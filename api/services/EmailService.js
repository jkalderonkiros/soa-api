var sg = require('sendgrid')(sails.config.email.sendgrid.api_key);
var helper = require('sendgrid').mail;
var from_email = new helper.Email('hello@devstudio506.com'); //sails.config.email.sendgrid.from


module.exports = {
  sendTo: function (to, subject, cnt) {
    return new Promise(function (yup, nope) {
      var to_email = new helper.Email(to);
      var content = new helper.Content('text/html', cnt);
      var mail = new helper.Mail(from_email, subject, to_email, content);

      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      });

      sg.API(request, function (error, response) {
        if (error) return nope(error);
        return yup();
      });
    });
  }
};
