   const socket = io();

    const device =  /Mobi|Android|Tablet|iPad/i.test(navigator.userAgent);
    if(device){
     document.getElementById("playNow").style.display="none"
     document.getElementById("mobile-buttons").style.display="block"
    }
    else{

      document.getElementById("playNow").style.display="block"
      document.getElementById("mobile-buttons").style.display="none"
    }

    const playScreen = document.getElementById("play-screen")
    const controlScreen = document.getElementById("control-screen")
    const gameselecScreen = document.getElementById("gameSelect");
    const gamEcode = document.getElementById("gameCode")
    const eGC=document.getElementById("eGc")
    const controller= document.getElementById("controller")
    const ready=document.getElementById("ready")
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let globalRoomCode=""

    function gameSelector(direc) {
    let cards = getCards();
    cards[cardIndex].classList.remove("selected");

    if (direc === "right") {
      cardIndex = (cardIndex + 1) % cards.length;
    } else if (direc === "left") {
      cardIndex = (cardIndex - 1 + cards.length) % cards.length;
    } else if (direc === "down"&& containerIndex < containers.length - 1) {
      if (containerIndex < containers.length - 1) {
        containerIndex++;
        cardIndex = Math.min(cardIndex, getCards().length - 1);
        scrollContainerIntoView();
      }
    } else if (direc === "up") {
      if (containerIndex > 0) {
        containerIndex--;
        cardIndex = Math.min(cardIndex, getCards().length - 1);
        scrollContainerIntoView();
      }
    }

    let selectedCard = getCards()[cardIndex];
    selectedCard.classList.add("selected");
    scrollCardIntoView(selectedCard);
    updateGameDetails();
    socket.emit("selectedGame",selectedCard.innerText,globalRoomCode)
    
  };
  
    const containers = document.querySelectorAll(".game-container");
    const gameSection = document.getElementById("gameSection");
    let containerIndex = 0;
    let cardIndex = 0;
    let ides=[]
    
    function getCards() {
      return containers[containerIndex].querySelectorAll(".game-card");
    }

    getCards()[cardIndex].classList.add("selected");
    updateGameDetails();

    function scrollCardIntoView(card) {
      card.parentElement.scrollTo({
        left: card.offsetLeft - card.parentElement.offsetWidth / 2 + card.offsetWidth / 2,
        behavior: "smooth"
      });
    }
    
     function updateGameDetails() {
    const selectedCardText = getCards()[cardIndex].innerText;
    document.querySelector(".video-Game").innerText = selectedCardText;
    document.querySelector(".discription-Game").innerText = selectedCardText;
    document.querySelector(".star-rate").innerText = selectedCardText;
  }
  function scrollContainerIntoView() {
    gameSection.scrollTo({
      top: containers[containerIndex].offsetTop - gameSection.offsetTop,
      behavior: "smooth"
    });
  }
  let gName=''

  socket.on("gamename",(selctgamenam)=>{
    gName=selctgamenam
    console.log(selctgamenam)
  })
  function enterGame(){
      if (gName) {
    socket.emit("canvas Opens",gName,globalRoomCode)
  } else {
    console.log("No game selected yet!");
  }
  }
  socket.on("number Control",(controlArray)=>{
    console.log(controlArray)
  })
  socket.on("no.Control",(gana)=>{
    console.log(gana)
  })
  
    socket.on("goSelector",(direction)=>{
      gameSelector(direction)
    })

    function sendToselec(direction) {
    const code = document.getElementById("room-input").value;
    socket.emit("move-selector", { roomCode: code, direction });
  }

    function goFullScreen(elem) {
  
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { // Safari
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE11
    elem.msRequestFullscreen();
  }
}    

 socket.on("everyone_ready",(pides,rC)=>{
        console.log(pides, rC);
        gameselecScreen.style.display="block"
        gamEcode.style.display="none"
        globalRoomCode=rC
        document.getElementById("rooMcode").innerText=globalRoomCode
   })      

    // Show pointer (console) on desktop click
    document.getElementById("playNow").addEventListener("click", () => {
      document.getElementById("buttons-section").style.display = "none";
      playScreen.style.display="block"
      gamEcode.style.display="block"
      goFullScreen(playScreen)
      const roomCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit code
      socket.emit("create_room", roomCode);
      socket.on("room_created", (roomCode) => {
      gamEcode.innerText=`Your Game Code ${roomCode}`
      });   
  });
   

    // Show controller on mobile click
    document.getElementById("play-browser").addEventListener("click", () => {
      document.getElementById("buttons-section").style.display = "none";
      controlScreen.style.display="block"
      goFullScreen(controlScreen)
      eGC.style.display="block"
    });
    
   document.getElementById("join-btn").addEventListener("click", () => {
    const code = document.getElementById("room-input").value;
    socket.emit("join_room", code);
  });

  const eVery=document.getElementById("evEry")
  

  socket.on("room_joined", (ids) => { 
     ready.style.display="block"
     eGC.style.display="none"
     ides.push(ids)
  }); 
  socket.on("welcome_message",(playerid)=>{alert(`welcome palyer ${playerid}`)
   eGC.style.display="none"
   ides.push(playerid)
})

  eVery.addEventListener("click",()=>{
    ready.style.display="none"
    controller.style.display="block"
    const rc=document.getElementById("room-input").value;
    socket.emit("everyone_Joined",{rc,ides})
  })