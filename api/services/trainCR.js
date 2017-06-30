// ================================================================
// openweather.js
// ================================================================


var axios = require('axios');

var template = (tpl, args) => tpl.replace(/\${(\w+)}/g, (_, v) => args[v]);

var getPage = function () {
  return new Promise(function (yup, nope) {

    //axios.defaults.headers.post['Content-Type'] = 'application/json';
    //axios.defaults.headers.post['Accept'] = 'application/json';
    //axios.defaults.headers.post['user-agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36';

    var tpl = '${url}';
    var url = template(tpl, {url: "https://www.facebook.com/Incofer-1504658679748677/"});

    axios
      .get(url)
      .then(function (res) {
        return yup(res.data);
      })
      .catch(function (error) {
        nope(error.response.data);
      });
  })
};

module.exports = {
  getPage: getPage
};
