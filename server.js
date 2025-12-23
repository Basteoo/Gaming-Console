const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = 3000;

let roomControllers = {}; 
app.get("/", (req, res) => {
  res.redirect("/main.html");
});
app.use(express.static("public/"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

 // Laptop creates a room
  socket.on("create_room", (roomCode) => {
    socket.join(roomCode);
    roomControllers[roomCode] = [];
    console.log(`Laptop created room: ${roomCode}`);
    io.to(socket.id).emit("room_created", roomCode);
  });
  
// Phone joins room
  socket.on("join_room", (roomCode) => {
    const room = io.sockets.adapter.rooms.get(roomCode);

    if (room) {
      socket.join(roomCode);
      console.log(`Phone joined room: ${roomCode}`);
             
      if (!roomControllers[roomCode]) roomControllers[roomCode] = [];
      roomControllers[roomCode].push(socket.id);
      
      let playerNumber = roomControllers[roomCode].length;

    // Send personalized welcome message
     if (playerNumber === 1) {
     io.to(socket.id).emit("room_joined",socket.id);
     } else {
      io.to(socket.id).emit("welcome_message",socket.id);
     }


      // Notify laptop that a phone connected
      socket.to(roomCode).emit("controller_connected", socket.id);
    } else {
      io.to(socket.id).emit("error_message", "Invalid room code");
    }
  });  

  socket.on("everyone_Joined",({rc,ides})=>{
    io.to(rc).emit("everyone_ready",ides,rc)
  })
  socket.on("selectedGame",(selctGame,gRoomCode)=>{
    let targetedId=roomControllers[gRoomCode][0]
    socket.to(targetedId).emit("gamename",selctGame)
  })
  socket.on("canvas Opens",(gamnam,gRoomC)=>{
    socket.to(gRoomC).emit("number Control",roomControllers[gRoomC])
    let tarId=roomControllers[gRoomC][0]
    socket.to(tarId).emit("no.Control",gamnam)
  })
  
  socket.on("move-selector",({roomCode,direction})=>{
    socket.to(roomCode).emit("goSelector",direction)
  })

socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
      for (let roomCode in roomControllers) {
      roomControllers[roomCode] = roomControllers[roomCode].filter(
        (id) => id !== socket.id
     );

       // If the room has no controllers left, clean up its entry
      if (roomControllers[roomCode].length === 0) {
        delete roomControllers[roomCode];
       }
     }

  });
});

 

http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})                                                                                                                                                                                                                                                                
