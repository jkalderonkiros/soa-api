/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  // POST /user
  create: function (req, res) {
    if (req.body.password !== req.body.confirmPassword) {
      return res.json(422, {err: 'Password doesn\'t match.'});
    }

    if (!valid.email(req.body.email)) {
      return res.json(422, {err: 'invalid email.'});
    }

    if (!valid.password(req.body.password)) {
      return res.json(422, {err: 'password must have at least 8 letters.'})
    }

    User.findOne({email: req.body.email}, function (err, user) {
      if (user) {
        return res.json(400, {err: 'email already registered'});
      }

      User.create(req.body).exec(function (err, user) {
        if (err) {
          return res.json(err.status, {err: err});
        }
        // If user created successfuly we return user and token as response
        if (user) {
          // NOTE: payload is { id: user.id}
          res.json(200, {user: user, token: jwToken.issue({id: user.id})});
        }
      });
    });
  },

  // GET /user/repos
  repos: function (req, res) {
    //TODO: extract this to a policy and apply to the endpoints below.
    User.findOne({id: req.token.id}, function (err, user) {
      if (err != null) return res.status(403).json({err: err});

      if (user.oauth_access_token == null) return res.status(422).json({err: "you need to connect to Github first"});
      page = req.query.page;

      github.getRepos(user.oauth_access_token, page)
        .then(function (repos) {
          return res.json(repos);
        })
        .catch(function (err) {
          return res.status(400).json({err: err})
        });
    });
  },

  // GET /user/pulls
  pulls: function (req, res) {
    User.findOne({id: req.token.id}, function (err, user) {
      if (err != null) return res.status(403).json({err: err});

      if (user.oauth_access_token == null) return res.status(422).json({err: "you need to connect to Github first"});
      page = req.query.page;

      github.getPullRequests(user.oauth_access_token, page)
        .then(function (pulls) {
          return res.json(pulls);
        })
        .catch(function (err) {
          return res.status(400).json({err: err})
        })
    });
  }
};
