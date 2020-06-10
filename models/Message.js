const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MessageSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },

});

mongoose.model('messages', MessageSchema);
