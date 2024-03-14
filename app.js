const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
var http = require('http').createServer(app);
const httpsRedirect = require('express-https-redirect');
var io = require('socket.io')(http);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', httpsRedirect());

require('./models/Message')
const Message = mongoose.model('messages')

// Static folder
app.use(express.static(path.join(__dirname, "public")));
mongoose.Promise = global.Promise;
// Connect to mongoose
const MongoURI = 'STRING'
const conn = mongoose.connect(MongoURI,{ useNewUrlParser: true, useUnifiedTopology: true }, function(){
  console.log("mongo is running")
  app.get('/', (req,res) => {
    res.send('index')
  });

  io.on('connection', (socket) => {
    // console.log('made socket connection', socket.id);

    Message.find({}).then(msg => {
      // console.log(msg)
      socket.emit('msg', msg)
    });
      // Handle chat event
      socket.on('chat', function(data){
          // console.log(data);
          const msg = new Message({
            name: data.handle,
            text: data.message
          })
          msg.save();
          io.sockets.emit('chat', data);
      });
      // Handle typing event
      socket.on('typing', function(data){
          socket.broadcast.emit('typing', data);
      });
  })
})

//
// http.listen(9999, () => {
//   console.log('listening on port:9999');
// });
http.listen(process.env.PORT);
