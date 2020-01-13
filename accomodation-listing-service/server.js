var mongoOp = require("./schema");


//'use strict'

const nats = require('nats')
const body_parser = require('body-parser');

var natsurl = process.env.NATS_SERVER_URL;
var url = `nats://${natsurl}`

const subgetlisting = "accomodate.get"
const subcreatelisting = "accomodation.create"
const nc = nats.connect({url: url, json: true})

nc.on('connect', () => {
  const opts = {}

  let count = 0
  nc.subscribe(subgetlisting, opts, (msg, reply) => {

    if (reply) {
      // give the response or echo back
	    console.log("Reply to - "+ reply);
	    console.log("Message - "+ msg.op)

      var d = {};
      mongoOp.find({},function(err,data){
            if(err) {
		d = data    
                msg = {"error" : true,"message" : "Error fetching data"};
            } else {
	        d = data	    
                msg = {"error" : false,"message" : "success"};
            }
	    nc.publish(reply,JSON.stringify(data))
        });

//      console.log(d)
//      nc.publish(reply, msg)
      console.log('Sent [' + count++ + '] reply "' + msg + '"')
      return
    }
    console.log('Dropping message "' + msg + '" - no reply subject set')
  })






    nc.subscribe(subcreatelisting, opts, (msg, reply)  => {
      // give the response or echo back
	 console.log("Checking subscribe...."); 
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

nc.on('unsubscribe', () => {
  process.exit()
})

nc.on('error', (err) => {
  console.log('Error [' + nc.currentServer + ']: ' + err)
  process.exit()
})

