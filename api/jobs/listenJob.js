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
        frequency: 'every 15 minutes',

        // Jobs options
        //options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            //priority: 'highest'
        //},

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
          console.log("listenJob");
          Type.findOne({name: "cr-train"}).exec(function(err, type) {

            console.log(err, type);
            if (type === undefined) {
              done();
              return;
            }

            trainCR.getPage().then(function (data) {
              Log.create({content: data, type: type.id}).exec(function(err, record) {
                console.log("Job executed created log!");
                done();
              });
            }).catch(function (err) {
              Log.create({content: err}).exec(function(err, record) {
                console.log("Job executed created error log!");
                done();
              });
            })
          })
        },
    };
    return job;
}
