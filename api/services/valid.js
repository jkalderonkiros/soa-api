module.exports.email = function(email) {
  var re = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return re.test(email);
};

module.exports.password = function (password) {
  return password.length >= 8
};
