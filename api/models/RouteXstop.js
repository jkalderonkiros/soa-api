/**
 * RouteXstop.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    route: {
      model: 'route',
      required: true
    },
    stop: {
      model: 'stop',
      required: true
    },
    arrival: {
      type: 'date',
      required: true
    },
    order: {
      type: 'integer',
      required: true
    },
    status: {
      type: 'string',
      enum: ['disable', 'enable', 'canceled'],
      required: true
    },

    // Change returned object.
    toJSON: function () {
      var obj = this.toObject();
      obj['route_obj'] = obj.route ? obj.route : null;
      obj['route'] = obj.route ? obj.route.id : '';
      obj['stop_obj'] = obj.stop ? obj.stop : null;
      obj['stop'] = obj.stop ? obj.stop.id : '';
      return obj;
    },
  }
};
