const express = require('express');
const router = express.Router();
const body_parser = require('body-parser');
const NATS = require('nats');

var natsurl = process.env.NATS_SERVER_URL;

console.log(`${natsurl}`)
var url = `nats://${natsurl}`

var subject = "accomodate.get";

 
 // Routes
/**
 * @swagger
 * /:
 *  get:
 *    description: Check if app is running
 *    responses:
 *      '200':
 *        description: Success response - Hotel? Trivago! 
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
	var response = {};

        var nc = NATS.connect({url: url, json: true});	

        nc.on('connect', function () {

           nc.request(subject, {"op": "get"}, {
		      max: 1, timeout: 5000
		   }, (msg) => {

             if (msg instanceof NATS.NatsError && msg.code === NATS.REQ_TIMEOUT) {
               
		  console.log('request timed out')
		  res.json({"status":"reqeust timed out"})

                 } else {
	           response = JSON.parse(msg)
                   res.json(response) 
                 }
             })
        
       })
        
       nc.on('error', (e) => {

         console.log('Failed to connect to nats-server.')
         res.json({"status":"failed - try again"}) 
          
        })	   

    })



/**
 * @swagger
 *
 * /accomodations:
 *   post:
 *      requestBody:
 *        description: Create an accomodation listing
 *        required: true
 *        content: 
 *          application/json:
 *            schema:
 *              - title: name
 *                type: String
 *      responses:
 *        200:
 *         description: Successfully posted create request to application.
 */
   .post(function(req,res){
        
        var nc = NATS.connect(url,{json: true});  

       nc.on('connect', function () {

               nc.publish("accomodation.create",req.body);
	       res.json({ stats: 'success' });
        })

	nc.on('error', function(e) {

	       console.log('Failed to connect to nats-server.')
               res.json({"status":"failed - try again"})
        });
  
    });

module.exports = router;
