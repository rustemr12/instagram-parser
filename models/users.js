var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/instagram_fk');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({

 user_id: { type: String, required: true },
 created_at: Date,
 followed_back: {type: Boolean, default: false}
});

var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
