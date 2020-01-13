const express = require('express');
const router = express.Router();
const body_parser = require('body-parser');

var NATS = require('nats');
var url = "nats://localhost:4222"

var subject = "accomodate.get";
var max = 2;

 
 // Routes
/**
 * @swagger
 * /:
 *  get:
 *    description: Check if app is running
 *    responses:
 *      '200':
 *        description: A successful response
 */



router.route("/")
    .get(function(req,res){

     res.send("Hotel? Trivago!");

    });

/**
 * @swagger
 * /accomodations:
 *  get:
 *    description: Get all accomodation listings
 *    responses:
 *      '200':
 *        description: All listing returned
 */




router.route("/accomodations")
    .get(function(req,res){
        var msg = {};
	var response = {};
        var nc = NATS.connect({url: url, json: true});	
        

	    console.log("1")

        nc.request(subject, {"op": "get"}, {
          max: max
        }, (msg) => {
	  response = JSON.parse(msg)
	  console.log("2")
          console.log('Received: ' + msg)
	 console.log("Response"+ response)

	res.json(response)
        })
        
        nc.on('unsubscribe', () => {
          process.exit()
        })
        
        nc.on('error', (e) => {
          console.log('Error [' + nc.currentServer + ']: ' + e)
          process.exit()
        })	    
       
//	res.json(response)

    })


/**
 * @swagger
 *
 * /accomodations:
 *   post:
 *      requestBody:
 *        description: Optional description in *Markdown*
 *        required: true
 *        content: 
 *          application/json:
 *            schema:
 *              - title: name
 *                type: String
 *      responses:
 *        200:
 *         description: Successfully posted a create request!
 */
   .post(function(req,res){
        
        var nc = NATS.connect(url,{json: true});  
        nc.publish("accomodation.create",req.body);
	res.json({ stats: 'success' });
  
    })

    .delete(function(req,res){

	    mongoOp.deleteMany({}, function(err){

			if(err){

				response = {"error" : true,"message" : err.message};

			} else {

				response = {"error" : true,"message" : "All data deleted!"};

			}
		    res.json(response);

	    });

    });

router.get('/:id', function (req, res) {
    let found = data.find(function (item) {
        return item.id === parseInt(req.params.id);
    });
    if (found) {
        res.status(200).json(found);
    } else {
        res.sendStatus(404);
    }
});




module.exports = router;
