/**
 * Created by raphaeljlps on 28/03/17.
 */

module.exports = {

  // GET /repo/pull
  // Params: owner: string, repo: string, number: integer (all required)
  // Return the specified pull request.
  pull: function (req, res) {
    User.findOne({id: req.token.id}, function (err, user) {
      if (err != null) return res.status(403).json({err: err});

      if (user.oauth_access_token == null) return res.status(422).json({err: "you need to connect to Github first"});

      owner = req.query.owner;
      repo = req.query.repo;
      number = req.query.number;

      github.getPullRequest(user.oauth_access_token, owner, repo, number).then(function (pull) {
        return res.json(pull);
      }).catch(function (err) {
        return res.status(400).json({err: err})
      })

    });
  },

  // POST /repo/merge
  // Body: {owner: string, repo: string, number: integer}
  // Merges and returns the merged pull request information.
  merge: function (req, res) {
    User.findOne({id: req.token.id}, function (err, user) {
      if (err != null) return res.status(403).json({err: err});

      if (user.oauth_access_token == null) return res.status(422).json({err: "you need to connect to Github first"});
      owner = req.body.owner;
      repo = req.body.repo;
      number = req.body.number;
      github.merge(user.oauth_access_token, owner, repo, number).then(function (result) {
        return res.json(result)
      }).catch(function (err) {
        return res.status(400).json({err: err})
      })

    });
  },

  // POST /repo/pulls
  // Body: [ {owner: string, repo: string, number: integer} ]
  // Returns a list with the specified pull requests.
  pulls: function (req, res) {
    User.findOne({id: req.token.id}, function (err, user) {
      if (err != null) return res.status(403).json({err: err});

      if (user.oauth_access_token == null) return res.status(422).json({err: "you need to connect to Github first"});

      pulls = valid.pulls({pulls: req.body});
      if (pulls.length == 0) return res.status(400).json({err: "invalid request, please check the body. allowed format: list of {owner: string, repo: string, number: integer}"});

      github.getSpecifiedPullRequests(user.oauth_access_token, pulls).then(function (result) {
        return res.json(result)
      }).catch(function (err) {
        return res.status(400).json({err: err})
      })


    });
  }
};
