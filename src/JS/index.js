const state = {
    score:{
        playerScore:0,
        computerScore:0,
        scoreBox:document.getElementById("score_points"),
    },

    cardSprites:{
        avatar:document.getElementById("card-image"),
        name:document.getElementById("card-name"),
        type:document.getElementById("card-type"),
        
    },
    playersSides : {
        player1:"player-cards",
        computer:"computer-cards",
        player1Box:document.querySelector(".card-box.framed#player-cards"),
        computerBox:document.querySelector(".card-box.framed#computer-cards"),
    },
    fieldCards:{
        player:document.getElementById("player-field-card"),
        computer:document.getElementById("computer-field-card"),
    },
    actions:{

        button:document.getElementById("next-duel"),
    },
}


const pathImages = "../../src/assets/icons/";
const cardData = [

    {
        id:0,
        name:"Blue Eyes White Dragon",
        type:"Paper",
        img:`${pathImages}dragon.png`,
        winOf:[1],
        loseOf:[2],
    },
    {
        id:1,
        name:"Dark Magician",
        type:"Rock",
        img:`${pathImages}magician.png`,
        winOf:[2],
        loseOf:[0],
    },
    {
        id:2,
        name:"Exodia",
        type:"Scissors",
        img:`${pathImages}exodia.png`,
        winOf:[0],
        loseOf:[1],
    },
];

const getRandomCardId = async ()=>{
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}
const createCardImage = async(idCard,fieldSide)=>{
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height","100px");
    cardImage.setAttribute("src","../../src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id",idCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playersSides.player1){
        cardImage.addEventListener("click",()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        })
    };

    cardImage.addEventListener("mouseover",()=>{
        drawSelectCards(idCard)
    })

    return cardImage;

};

const setCardsField = async (cardId)=>{
    await removeAllCardsImages();
    
    let computerCardId = await  getRandomCardId();
    
    await showCardsDetails(true);
    await hiddenCardsDetails();
   
    await drawCardsInField(cardId,computerCardId);


    let duelResult = await checkDuelResult(cardId,computerCardId);
    await updateScore();
    await drawButton(duelResult);

}


const drawCardsInField = async (cardId,computerCardId)=>{
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

const showCardsDetails = async (value)=>{
    if(value ){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    
    if(!value){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}
const hiddenCardsDetails =  async()=>{
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}
const updateScore = async()=>{
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

const checkDuelResult = async (playerCardId,computerCardId)=>{
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];
    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "Ganhou";
        await playSound("win.wav");
        state.score.playerScore++;
    }else if(playerCard.loseOf.includes(computerCardId)){
        duelResults = "Perdeu";
        await playSound("lose.wav");
        state.score.computerScore++;
    }

    return duelResults;
}

const drawButton = async (text)=>{
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}


const removeAllCardsImages = async()=>{
    let {computerBox,player1Box} = state.playersSides;
    let imageElements = computerBox.querySelectorAll("img");
    imageElements.forEach((image)=>image.remove());


   
    imageElements = player1Box.querySelectorAll("img");
    imageElements.forEach((image)=>image.remove());
}

const drawSelectCards = async (index)=>{
    state.cardSprites.avatar.src= cardData[index].img;
    state.cardSprites.name.innerHTML = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;

}


const drawCards = async (cardNumbers, fieldSide)=>{
        for(let i =0;i<cardNumbers;i++){    
            const randomIdCard = await getRandomCardId();
            const cardImage = await createCardImage(randomIdCard,fieldSide);
            
            
            document.getElementById(fieldSide).appendChild(cardImage);

        }
}

const resetDuel = async () =>{
        state.cardSprites.avatar.src = "";
        state.actions.button.style.display = "none";


        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
        drawCards(5,state.playersSides.player1);
        drawCards(5,state.playersSides.computer);
        
        
}

const init = (()=>{

    showCardsDetails(false);

    drawCards(5,state.playersSides.player1);
    drawCards(5,state.playersSides.computer);
    const bgm = document.getElementById("bgm");
    bgm.play();
        
})();

const playSound = async(status)=>{
  
    const audio = new Audio(`../../src/assets/audios/${status}`);
    try {
        audio.play();
        
    } catch (error) {
        window.alert("audio corrompido ou nao encontrado!!" , error);
    }
}