/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var Hashes = require('jshashes'),
  SHA256 =  new Hashes.SHA256,
  hmacKey = process.env.HMAC_SECRET_KEY || 'mysecurehmackey';

module.exports = {
  index: function (req, res) {
    var email = req.param('email');
    var password = req.param('password');

    if (!email || !password) {
      return res.json(401, {err: 'email and password required'});
    }
    if (!valid.email(email)) {
      return res.json(422, {err: 'invalid email.'});
    }

    if (!valid.password(password)) {
      return res.json(422, {err: 'password must have at least 8 letters.'})
    }

    User.findOne({email: email}, function (err, user) {
      if (!user) {
        return res.json(401, {err: 'invalid email or password'});
      }

      User.comparePassword(password, user, function (err, valid) {
        if (err) {
          return res.json(403, {err: 'forbidden'});
        }

        if (!valid) {
          return res.json(401, {err: 'invalid email or password'});
        } else {
          res.json({
            user: user,
            token: jwToken.issue({id : user.id })
          });
        }
      });
    })
  },

  //POST: /auth/reset_token
  // Sends the reset token to the user's email.
  reset_token: function (req, res) {
    email = req.body.email;

    User.findOne({email: email}, function (err, user) {
      if (!user) {
        return res.json(400, {err: 'email not found'});
      }

      str = email + user.id;
      token = SHA256.b64_hmac(hmacKey, str);
      //TODO: make this a HTML and move this to another local
      url = "Click here to open your reset token in otto: seesawOtto://local?email="+email+"&user_id="+user.id+"&token=" +token;
      EmailService.sendTo(email, 'Your otto reset token', url).
        then(function () {
          res.json({message: 'email sent to ' + email})
        }).
        catch(function (error) {
          res.json({err: error})
      });

    });

  },

  //POST /auth/change_password
  change_password: function (req, res) {
    token = req.body.token;
    email = req.body.email;
    str =  email + req.body.user_id;
    generatedToken = SHA256.b64_hmac(hmacKey, str);
    newPassword = req.body.new_password;
    //not good I know, but we don't have SHA256.compare in this lib to make constant comparisons
    if (token == generatedToken) {
     User.update({email: email}, {password: newPassword}).exec(function (err, user){
       if (err) return res.json(500, {err: err});
       res.json({message: 'Password updated'});
     })


    } else {
      res.json(400, {err: 'Invalid token'})
    }

  }
};
