// ================================================================
// github.js
// ================================================================


var axios = require('axios'),
  GitHubApi = require("github"),
  githubAPI = new GitHubApi({Promise: require('bluebird')});

var auth = function (token) {
  githubAPI.authenticate({
    type: 'oauth',
    token: token
  });

  return new Promise(function (yup, nope) {
    yup();
  });
};

var getToken = function (code) {
  return new Promise(function (yup, nope) {
    if (!code) {
      return nope("Invalid code");
    }


    var payload = {
      client_id: sails.config.github.clientId,
      client_secret: sails.config.github.secret,
      accept: "json",
      code: code
    };


    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.post['Accept'] = 'application/json';
    axios
      .post(sails.config.github.access_token_url, payload)
      .then(function (res) {
        yup(res.data.access_token);
      })
      .catch(function (error) {
        nope(error);
      });
  })
};

var getUserInfo = function (token) {
  return new Promise(function (yup, nop) {
    auth(token)
      .then(function () {
        githubAPI.users.get({}, function (err, res) {
          if (err) return nop(err);
          return yup(res)

        });
      })
      .catch(function (error) {
        return nop(error)
    });
  })

};

var getEmails = function (token, page) {
  page = page || 1;

  return new Promise(function (yup, nope) {

    auth(token).
      then(function () {
      githubAPI.users.getEmails({
        page: page
      }, function (err, res) {
        if (err) {
          return nope(err);
        }
        return yup(res);
      })
     })
      .catch(function (err) {
        return nope(err);
      })
  })
};


var getRepos = function (token, page) {
  page = page || 1;
  return new Promise(function (yup, nope) {
    auth(token).
      then(function () {
        githubAPI.repos.getAll({page: page, per_page: 100}, function (err, res) {
          if (err) return nope(err);
          return yup(res);
        })

    }).catch(function (err) {
        return nope(err);
    })
  })
};

var getPullRequests = function (token, page) {
  return new Promise(function (yup, nope) {
    getRepos(token)
      .then(function (repos) {
        Promise.all(repos.map(function (repo) {
          return githubAPI.pullRequests.getAll({owner: repo.owner.login, repo: repo.name})
        })).then(function (pulls) {
          result = pulls.filter(function(pull) {
            return pull.length
          });
          return yup(result)
        }).catch(function (err) {
          return nope(err)
        });
      })
      .catch(function (err) {
        return nope(err);
      })

  })
};

var getSpecifiedPullRequests = function (token, list) {
  return new Promise(function (yup, nope) {
    Promise.all(list.map(function (pr) {
      return githubAPI.pullRequests.get(pr)
    })).then(function (pulls) {
      return yup(pulls)
    }).catch(function (err) {
      return nope(err)
    })
  })
};


var getPullRequest = function (token, owner, repo, number) {
  return new Promise(function (yup, nope) {
    githubAPI.pullRequests.get({owner: owner, repo: repo, number: number}, function (err, pull) {
      if (err) return nope(err);
      githubAPI.pullRequests.getCommits({owner: owner, repo: repo, number: number}, function (error, commits) {
        if (error)  return yup({pull: pull});
        return yup({pull: pull, commits: commits})
      });
    })
  })
};


var merge = function (token, owner, repo, number) {
  return new Promise(function (yup, nope) {
    githubAPI.pullRequests.merge({owner: owner, repo: repo, number: number}, function (err, res) {
      if (err) return nope(err);
      return yup(res);
    });
  })
};

module.exports = {
  auth: auth,
  getEmails: getEmails,
  getToken: getToken,
  getUserInfo: getUserInfo,
  getRepos: getRepos,
  getPullRequests: getPullRequests,
  getPullRequest: getPullRequest,
  getSpecifiedPullRequests: getSpecifiedPullRequests,
  merge: merge
};
