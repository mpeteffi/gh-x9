'use strict';

module.exports = (function() {

  var GitHubApi = require('github')
  , async = require('async')
  , str = require('./common/String');

  var github = new GitHubApi({
    version: "3.0.0",
    timeout: 10000
  });

  github.authenticate({
    type: 'oauth',
    token: '0933fd216bd24235abae05e165a12d9819085556'
  });

  var fetchGHApi = function(cb) {
    if (typeof cb !== 'function') {
      throw 'Invalid callback: ' + cb;
    }
    github.repos.getForks(
      { "user": "cwisoftware", repo: "crescer-2015-2" },
      function(err, res) {

        var forksActivity = [], commitsRequests = [];
        if (err) console.error('error getForks: ' + err);
        if (typeof res === 'undefined') cb(forksActivity);

        res.sort(function(a, b) {
          return new Date(b.pushed_at) - new Date(a.pushed_at);
        });
        res.forEach(function(forkAluno) {

          //console.log(forkAluno);

          var diff = new Date() - new Date(forkAluno.pushed_at);
          var inSeconds = Math.ceil(diff / 1000);
          var inMinutes = Math.ceil(inSeconds / 60);
          var inHours = Math.ceil(inMinutes / 60);
          var inDays = Math.ceil(inHours / 24);
          var ultimoCommit = '';

          if (inHours > 24) {
            ultimoCommit = String.format("{0} dias atrás", inDays);
          } else if (inMinutes > 60) {
            ultimoCommit = String.format("{0} hrs atrás", inHours);
          } else if (inMinutes < 60) {
            ultimoCommit = String.format("{0} min atrás", inMinutes);
          }

          (function() {
            commitsRequests.push(
              function(callb) {
                github.repos.getCommits({ user: forkAluno.owner.login, repo: "crescer-2015-2" }, function(err, commits) {
                  var activity = {
                    avatar_url: forkAluno.owner.avatar_url,
                    url_fork: forkAluno.html_url,
                    usuario: forkAluno.owner.login,
                    ultimo_commit: {
                      timestamp: ultimoCommit,
                      mensagem: commits[0].commit.message,
                      url: commits[0].html_url
                    }
                  };
                  callb(null, activity);
                });
              }
            );
          })();
        });
        
        async.parallel(commitsRequests, function(err, data) {
          cb(data);
        })
      }
    );
  };

  return { fetch: fetchGHApi };

})();
