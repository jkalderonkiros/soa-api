/**
 * OauthController
 *
 * @description :: Server-side logic for managing oauths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  /**
   * `OauthController.authorize()`
   */
  authorize: function (req, res) {
    var state = req.headers['x-request-id'] || '877bd28f-6256-47cc-9f64-b270505local';

    return res.redirect(sails.config.github.authorize_url +
      "?scope=" + sails.config.github.scopes +
      "&client_id=" + sails.config.github.clientId +
      "&state=" + state);
  },


  /**
   * `OauthController.callback()`
   */
  callback: function (req, res) {
    var code = req.query.code;
    //TODO: refactor this into a service.

    github.getToken(code)
    .then(function(token) {
      github.getEmails(token).
        then(function (emails) {
         primary = emails.find(function (e, i, arr) {
            if (e.primary) return e;
          });


        User.findOne({email: primary.email}, function (err, user) {
            if (user) {
              User.update({email: primary.email}, {oauth_access_token: token}).exec(function (err, updated) {
                if (err != null) return res.json({err: err});
                return res.json({
                  user: user,
                  token: jwToken.issue({id : user.id })
                });

              });

            } else {
              //TODO: fix password
              User.create({email: primary.email, oauth_access_token: token, password: ''}).exec(function (err, user) {
                if (err) {
                  return res.json(err.status, {err: err});
                }
                // If user created successfuly we return user and token as response
                if (user) {
                  res.json(200, {user: user, token: jwToken.issue({id: user.id})});
                }
              });
            }

        });
      }).
      catch(function (error) {
        res.send(400).json({err: error})
      });

    })
    .catch(function(error) {
      res.send(400).json({err: error})
    });
  }
};
