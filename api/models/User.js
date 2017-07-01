/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const saltRounds = 10;


module.exports = {

  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true
    },

    first_name: {
      type: 'string',
      default: ''
    },

    last_name: {
      type: 'string',
      default: ''
    },

    roles: {
      type: 'array',
      //required: true,
      default: []
    },

    oauth_access_token: {
      type: 'string'
    },

    encryptedPassword: {
      type: 'string'
    },

    status: {
      type: 'string',
      enum: ['disable', 'enable'],
      required: true
    },

    // Remove the encrypted password from the returned object.
    toJSON: function () {
      var obj = this.toObject();
      delete obj.encryptedPassword;
      delete obj.password;
      delete obj.confirmPassword;
      delete obj.oauth_access_token;
      return obj;
    }
  }
};
