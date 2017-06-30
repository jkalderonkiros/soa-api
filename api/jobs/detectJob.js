const cheerio = require('cheerio');

module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        //name: 'Foo',

        // set true to disabled this job
        disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
        frequency: 'every 10 seconds',

        // Jobs options
        //options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            //priority: 'highest'
        //},

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
          console.log("detect job");

          Type.findOne({name: "cr-train"}).exec(function(err, type) {

            console.log(err, type);
            if (type === undefined) {
              done();
              return;
            }


            Log.find({type: type.id, status: 'pending'}).limit(1).sort({createdAt: -1}).exec(function(err, logs) {
              console.log("logs", logs.length);
              if (logs.length === 0) {
                done();
              }
              else {
                let log = logs[0];
                let $ = cheerio.load(log.content);
                $ = $('div.userContent');
                let message = $.first().text().trim();
                message = message ? message : 'no content found';

                Event.find({type: type.id}).limit(1).sort({createdAt: -1}).exec(function(err, events) {
                  console.log("events", err, events.length);
                  log.status = 'processed';
                  log.save();
                  if (events.length === 0 || (events.length > 0 && events[0].content != message)) {
                    console.log("message", message);
                    Event.create({content: message, type: type.id}).exec(function(err, event) {
                      console.log("created event!", err, event);
                      //send email and/or notification
                      done();
                    });
                  }
                  else {
                    done();
                  }
                })
              }
            });
          })

        },
    };
    return job;
}
