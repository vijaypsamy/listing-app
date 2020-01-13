let mongoose = require('mongoose')

const server = process.env.MONGODB_URL
const database = process.env.MONGODB_NAME
const user = process.env.MONGODB_USERNAME
const password = process.env.MONGODB_PASSWORD

mongoose.connect(`mongodb://${server}/${database}?authSource=admin`, {
    useNewUrlParser: true,
    user: `${user}`,
    pass: `${password}`
}).then(() => {
    console.log('successfully connected to the database');
}).catch(err => {
    console.log('error connecting to the database');
    process.exit();
});

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
