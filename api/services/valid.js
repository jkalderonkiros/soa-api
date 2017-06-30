
module.exports.email = function(email) {
  // var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  var re = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return re.test(email);
};

module.exports.password = function (password) {
  return password.length >= 8
};


module.exports.pulls = function (options) {
  pulls = options.pulls;
  return pulls.filter(function (pull) {
    return (pull.owner && (typeof pull.owner === 'string' || pull.owner instanceof String)) &&
      (pull.repo && (typeof pull.repo === 'string' || pull.repo instanceof String)) &&
      (pull.number && (typeof pull.number === 'number' || pull.number instanceof Number))
  })
};
