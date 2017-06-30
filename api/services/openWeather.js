// ================================================================
// openweather.js
// ================================================================


var axios = require('axios');

var template = (tpl, args) => tpl.replace(/\${(\w+)}/g, (_, v) => args[v]);

var getWeatherByCity = function (id) {
  return new Promise(function (yup, nope) {
    if (!id) {
      return nope("Invalid city");
    }

    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.post['Accept'] = 'application/json';

    var tpl = '${url}/data/2.5/weather?id=${id}&units=metric&APPID=${APIKEY}';
    var url = template(tpl, {url: sails.config.openweather.url, id: id, APIKEY: sails.config.openweather.apiKey});

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

var getWeatherByCoordinates = function (lat, lon) {
  return new Promise(function (yup, nope) {
    if (!lat || !lon) {
      return nope("Invalid coordinates");
    }

    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.post['Accept'] = 'application/json';

    var tpl = '${url}/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&APPID=${APIKEY}';
    var url = template(tpl, {url: sails.config.openweather.url, lat: lat, lon: lon, APIKEY: sails.config.openweather.apiKey});

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

var getUVIndexByCoordinates = function (lat, lon) {
  return new Promise(function (yup, nope) {
    if (!lat || !lon) {
      return nope("Invalid coordinates");
    }

    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.post['Accept'] = 'application/json';

    var tpl = '${url}/v3/uvi/${lat},${lon}/current.json?APPID=${APIKEY}';
    var url = template(tpl, {url: sails.config.openweather.url, lat: lat, lon: lon, APIKEY: sails.config.openweather.apiKey});

    console.log("url", url);
    axios
      .get(url)
      .then(function (res) {
        return yup(res.data);
      })
      .catch(function (error) {
        console.log("error", error);
        nope(error.response.data);
      });
  })
};

module.exports = {
  getWeatherByCity: getWeatherByCity,
  getWeatherByCoordinates: getWeatherByCoordinates,
  getUVIndexByCoordinates: getUVIndexByCoordinates
};
