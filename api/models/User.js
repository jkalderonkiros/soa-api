/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = {

  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true
    },

    oauth_access_token: {
      type: 'string'
    },

    encryptedPassword: {
      type: 'string'
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
  },


  //Encrypt the password before create the user record.
//  beforeCreate : function (values, next) {
//    bcrypt.hash(values.password, saltRounds, function (err, hash) {
//      if (err) return next(err);
//      values.encryptedPassword = hash;
//      next();
//    });
//  },

  //Compare method
//  comparePassword : function (password, user, cb) {
//    bcrypt.compare(password, user.encryptedPassword, function (err, match) {
//
//      if(err) cb(err);
//      if(match) {
//        cb(null, true);
//      } else {
//        cb(err);
//      }
//    })
//  }

};
