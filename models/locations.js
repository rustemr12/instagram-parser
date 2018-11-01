var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/instagram_fk');
var Schema = mongoose.Schema;

// create a schema
var locationSchema = new Schema({

 location_url: { type: String, required: true },
 location_name: { type: String, required: true },
 status: { type: String, default: "PENDING" },
 created_at: Date
});

var Location = mongoose.model('Location', locationSchema);

// make this available to our users in our Node applications
module.exports = Location;
