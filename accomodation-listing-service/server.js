var mongoOp = require("./schema");

const nats = require('nats')
const body_parser = require('body-parser');

var natsurl = process.env.NATS_SERVER_URL;
var url = `nats://${natsurl}`

const subgetlisting = "accomodate.get"
const subcreatelisting = "accomodation.create"
const nc = nats.connect({url: url, json: true})

nc.on('connect', () => {
  const opts = {}

  nc.subscribe(subgetlisting, opts, (msg, reply) => {

    if (reply) {
		
      mongoOp.find({},function(err,data){
            if(err) {
                msg = {"error" : true,"message" : "Error fetching data"};
            } else {
                msg = {"error" : false,"message" : "success"};
            }
            nc.publish(reply,JSON.stringify(data))
        });

      return
    }
    console.log('Dropping message "' + msg + '" - no reply subject set')
  })

  nc.subscribe(subcreatelisting, opts, (msg, reply)  => {

      var db = new mongoOp(msg);
      var response = {};
      db.save(function(err){
            if(err) {
                response = {"error" : true,"message" : err.message};
                    console.log(response);
            }
              else {
                response = {"error" : false,"message" : "Data added"};
                      console.log(response);
            }
        });

      return
  })

})

nc.on('error', (err) => {
  console.log('Error connecting to nats-server.')
})

