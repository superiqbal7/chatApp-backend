module.exports = function (io) {
  io.on('connection', (socket)=>{
    // console.log('User Connected');
    socket.on('refresh',(data) => {
      //console.log(data);
      io.emit('refreshPage',{})
    })
  })
}
