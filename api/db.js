const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
const kittySchema = new mongoose.Schema({
  name: String
});
const Kitten = mongoose.model('Kitten', kittySchema);


const agentSchema = new mongoose.Schema({
	registration_end_date: Date,
	estate_agent_license_no: String,
	salesperson_name: String,
	registration_no: String,
	registration_start_date: Date,
	estate_agent_name: String,
	_id: Number
});
const Agent = mongoose.model('Agent', agentSchema);


module.exports = {
	Kitten,
	Agent
};