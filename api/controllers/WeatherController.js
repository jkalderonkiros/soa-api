/**
 * WeatherController
 *
 * @description :: Server-side logic for managing venues
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  city: function (req, res) {
    var id = req.param('id');

    openWeather.getWeatherByCity(id).then(function (data) {
      return res.json(data);
    }).catch(function (err) {
      return res.status(400).json({err: err})
    })
  },

  coordinates: function (req, res) {
    var param = req.param('id');
    if (!param) {
      return res.status(400).json({err: "Invalid coordinates"})
    }
    var coordinates = param.split(',')

    openWeather.getWeatherByCoordinates(coordinates[0], coordinates[1]).then(function (data) {
      return res.json(data);
    }).catch(function (err) {
      return res.status(400).json({err: err})
    })
  }

};
