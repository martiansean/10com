function GenHTML(name,message) {
  return  `
    <div class="text-box">
      <p class="name">${name}</p>
      <p class="msg">${message}</p>
    </div>
  `
}

var socket = io.connect('https://computer10.herokuapp.com');

// Query DOM
var message = document.getElementById('message');
var  handle = document.getElementById('handle');
var  btn = document.getElementById('send');
var  output = document.getElementById('data');
var  feedback = document.getElementById('feedback');

function updateScroll(){
    if(!scrolled){
        var element = document.getElementById("data");
        element.scrollTop = element.scrollHeight;
    }
}

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
})
socket.on('msg', function(data){
  console.log(data)
  for(let i in data){
    let x = data[i]
    output.innerHTML += GenHTML(x.name, x.text)
  }
  updateScroll();
})
// Listen for events
socket.on('chat', function(data){
    console.log(data)
    feedback.innerHTML = '';
    // output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    output.innerHTML += GenHTML(data.handle, data.message)
    updateScroll();
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});


var isControlKeyDown = false;
var scrolled = false;



output.on('scroll', function(){
    scrolled=true;
});
