let mongoose = require('mongoose')
let urlExists = require('url-exists');

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
	  validate: {
            validator: function(v) {
                    if(this.category === 'hotel'){
		    return !v.includes("Free") && !v.includes("Offer") && !v.includes("Book") && !v.includes("Website") ;
		    } else return true;
                 },
	         message: 'Give a different name please.'},
          required: [true, "Please provide a name"],
	  minlength: 11
          },

  rating: {

          type: Number,
          min: [-1],
          max: [5],
          required: [true]

  },

  category: {
          type: String,
          enum: ['hotel', 'alternative', 'hostel', 'lodge', 'resort', 'guesthouse'],
          required: [true, 'Please enter a valid category, one of - hotel, alternative, hostel, lodge, resort or guesthouse']
  },

  location: {

          type: locationSchema,
          required: true


  },
  
  image: {
          type: String,
          match: [/((http|https):\/\/)?[a-zA-Z]\w*(\.\w+)+(\/\w*(\.\w+)*)*(\?.+)*/,'Please enter a valid URL'],
          required: [true, 'Please enter an image URL']
         }
 }); 
 
module.exports = mongoose.model('Accomodations', AccomodationSchema)

