let mongoose = require('mongoose')

const server = 'localhost:27017'
const database = 'itemsdb'
const user = 'admin'
const password = '******'

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost:27017/itemsdb', {newUrlParser: true})

var locationSchema = new mongoose.Schema({
          city: {
                  type: String,
                  required: [true]
          },
          state: {
                  type: String,
                  required: [true]

          },
          country: {

                 type: String,
                  required: [true]

          },
          zip_code: {
                  type: Number,
                  required: true

          },
          address: {

                  type: String,
                  required: true

          }

});


let AccomodationSchema = new mongoose.Schema({
  name: {
          type: String,
          required: [true, "Please provide a name"],
          },

  rating: {

          type: Number,
          min: [-1],
          max: [5],
          required: [true]

  },

  category: {
          type: String,
          enum: ['Hotel','Motel','Private Property'],
          required: [true]
  },

  location: {
	  
	  type: locationSchema,
	  required: true
	  
	  
  }
  
});
  

module.exports = mongoose.model('Accomodations', AccomodationSchema)
