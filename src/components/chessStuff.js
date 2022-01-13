import React, { useState, useEffect, useRef, useContext } from "react";
import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import { ChessContext } from "../Context/chess-context";
import Swal from "sweetalert2";
import CheckMate from '../images/checkMate.jpg';///////New Code
import './chessStuff.css'
import { TransitionGroup } from "react-transition-group";
import Fade from 'react-reveal/Fade';
import PeacePic from "../images/peace.jpg"
import CheerUp from "../images/cheerUp.jpg"
import RainbowBtn from "../images/rainbowBtn.jpg"
import ReactTooltip from 'react-tooltip';
import Select from 'react-dropdown-select';



function Chessstuff() {
  const [game, setGame] = useState(new Chess());
  const [sendText, setSendText] = useState(true);
  const [recipient, setRecipient] = useState("");
  const [yourName, setYourName] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [isThisMyMove, setIsThisMyMove] = useState(false);
  const chessStuffCtx = useContext(ChessContext);
  const [turn, setTurn] = useState("w")
  const [transcript, setTranscript] = useState([])
  const boardRef = useRef();
  const [chatText, setChatText] = useState([])
  const textAreRef = useRef()
  let tranDiv = document.getElementById("trDiv");
  let textChatArea = document.getElementById("chatText")
  const [hoverOverMySpan, setHoverOverMySpan] = useState(true)

  const [checkFlag, setCheckFlag] = useState(0);
  const [pieceStyle, setPieceStyle] = useState('');

  const [darkSquareColor, setdarkSquareColor] = useState('#B58863');
  const [lightSquareColor, setlightSquareColor] = useState('#F0D9B5');

  const [optionSquares, setOptionSquares] = useState({});

  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});

  const colorOptions = [
    { value:  'default'  , label:  'default'   }, 
    { value:  'red'  , label:  'red'   },
    { value:  'orange'  , label:  'orange'   },
    { value:  'gold'  , label:  'gold'   },
    { value:  'green'  , label:  'green'   },
    { value:  'cyan'  , label:  'cyan'   },
    { value:   'blue' , label:  'blue'   },
    { value:  'purple'  , label:   'purple'  },
    { value:  'pink'  , label:   'pink'  },
    { value:  'modern'  , label:   'modern'  },
  ]
  const piecesOptions = [
    { value:  'default'  , label:  'default'   }, 
    { value:  'alternative'  , label:  'alternative'   },
    { value:  'maestro'  , label:  'maestro'   },
    
  ]


  const gameResultCall = (outcome) => fetch('https://calm-beyond-32997.herokuapp.com/api/users/'
  + outcome + "/" + chessStuffCtx.onloginUserData.username, 
      {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({
            username: "knights",
            password: "p4ssw0rd",
            
          })
    })


    
  
  

  //const opponentPic = chessStuffCtx.onAllPlayersArr.
  //filter(p=>p.username===chessStuffCtx.oncurrentOpponent)[0].photoLoc

  let j = 0;

  const matingCall = () => {
    gameResultCall("losses")
    Swal.fire({
      title: " Mate! you lost.",
      icon: "error",

      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: "OK!",
    }).then((res) => chessStuffCtx.onSetGameInProgress(false));
  };

  let socket = useRef(null)//test

  useEffect(()=>{
    if(transcript.length) {
      tranDiv.scrollTop = tranDiv.scrollHeight
    }
  },[transcript])

  useEffect(() => {
    console.log("useeffect ruuuuuuns");
    socket.current = new SockJS(
      "https://glacial-lowlands-14052.herokuapp.com/hello"
    );
    setStompClient(Stomp.over(socket.current));
    let stompClient = Stomp.over(socket.current);
    stompClient.connect(
      { username: chessStuffCtx.onloginUserData.username },
      function (frame) {
        stompClient.subscribe("/users/queue/messages", function (greeting) {
          const messageSender = JSON.parse(greeting.body).from;
          const messageReceived = JSON.parse(greeting.body).text
          console.log(messageReceived);
          console.log("From: " + messageSender);
          

          if (messageReceived==="~~~~letsPlay~~~~") {
                  
           
            if (chessStuffCtx.onGameInProgress) {
              console.log('otherPlListCtx.onGameInProgress is ', chessStuffCtx.onGameInProgress);
              //sendMessage(messageSender, "~~~~gameInProgress~~~~")


              stompClient.send(
                "/app/hello/hellouser",
                {},
                JSON.stringify({
                  from: chessStuffCtx.onloginUserData.username,
                  to: messageSender,
                  text: "~~~~gameInProgress~~~~",
                })
              );
                      
                  } else {
                    setIsThisMyMove(false);
                    makeAMove(JSON.parse(greeting.body).text);
                  }

          }   

        });

        stompClient.subscribe('/users/queue/chat', function (greeting) {
          const messageText = JSON.parse(greeting.body).text
          const messageFrom = JSON.parse(greeting.body).from
          console.log(messageText);
          console.log("From: " + JSON.parse(greeting.body).from);

          if(messageText==="~~~~Tie~~~~"){

            Swal.fire({
              title: 'You are both mighty!',
              text: 'A tie offer from '+messageFrom,
              showCancelButton: true,
              showConfirmButton:true,
              confirmButtonText:"Accept",
              cancelButtonText:'Deny',
              
              imageUrl: PeacePic,
              imageWidth: '80%',
              imageHeight: '80%',
              imageAlt: 'Peace offering',
            }).then(res=> {
                if(res.isConfirmed){

                  gameResultCall("ties")

                  stompClient.send("/app/hello/chattext", {}, JSON.stringify({
                    from:chessStuffCtx.onloginUserData.username, 
                  to: messageFrom,
                  text:"~~~~TieAccepted~~~~"}));

                chessStuffCtx.onSetGameInProgress(false)
                  //chessStuffCtx.onsetCurrentOpponent(messageSender)
                  

                } else if (res.isDenied || res.dismiss) {

                  stompClient.send("/app/hello/chattext", {}, JSON.stringify({
                    from:chessStuffCtx.onloginUserData.username, 
                  to: messageFrom,
                  text:"~~~~TieRejected~~~~"}));

            
                }
            })

          } else if(messageText==="~~~~IGiveUp~~~~"){

            gameResultCall("wins")

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your opponent gave up. You are too good',
              showConfirmButton: false,
              timer: 2000
            }).then(res=>{
             
              chessStuffCtx.onSetGameInProgress(false);
             
            })

          
          } else if(messageText==="~~~~TieAccepted~~~~"){

            gameResultCall("ties")

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Tie offer accepted. Good game!',
              showConfirmButton: false,
              timer: 2000
            }).then(res=>{
             
              chessStuffCtx.onSetGameInProgress(false);
             
            })

          } else if(messageText==="~~~~TieRejected~~~~"){

            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Tie offer rejected. We fight to death',
              showConfirmButton: false,
              timer: 2000
            })

          } else {
            
            updateChatArr(messageFrom, messageText)
          }

          
          
        });

        

        stompClient.subscribe("/topic/greetings", function (greeting) {
          showGreetingShared(greeting.body);
        });
      }
    );

    chessStuffCtx.onBoardOrientation === "w"
      ? setIsThisMyMove(true)
      : setIsThisMyMove(false);

    console.log(stompClient.connected); //test

    console.log(
      "chessStuffCtx.onBoardOrientation",
      chessStuffCtx.onBoardOrientation
    );

    return ()=> stompClient.disconnect()

  }, [chessStuffCtx.onloginUserData.username]);

  const showGreetingShared = (mes) => {
    //setMessagesObj((oldMes)=> [mes,...oldMes]);
    console.log(mes);
  };

  function sendMessageShared() {
    stompClient.send(
      "/app/hello/helloworld",
      {},
      JSON.stringify({
        sharedUMessage: chessStuffCtx.onloginUserData.username + " is online",
      })
    );
  }

  function sendMessage(myMove) {
    

    stompClient.send(
      "/app/hello/hellouser",
      {},
      JSON.stringify({
        from: chessStuffCtx.onloginUserData.username,
        to: chessStuffCtx.oncurrentOpponent,
        text: myMove,
      })
    );
  }

  function sendChatText(sendText) {
  
    
    stompClient.send("/app/hello/chattext", {}, JSON.stringify({
      from:chessStuffCtx.onloginUserData.username, 
    to: chessStuffCtx.oncurrentOpponent,
    text:sendText}));
    
   
  }

  

  const updateChatArr = (from, newChat) => {
    setTranscript(prev=>[...prev, {who: from, message: newChat}])
    
   
    
    j++
    console.log(j);
    
  }

  const makeAMove = (move) => {
    console.log("the move", move.split(","));
    let [from, to, pieceColor] = move.split(",");
    console.log(from, to, pieceColor);

    onDrop(from, to, pieceColor);
  };



  // perform modify function on game state
  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  // perform action when piece dropped by user
  function onDrop(sourceSquare, targetSquare, piece) {
    
    console.log(game.turn());//test
    
    if (piece[0] !== chessStuffCtx.onBoardOrientation && piece.length === 2)
      return;

    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    });

    if (move !== null) {
      setTurn(game.turn())
      console.log('transcriiiiiiiiiiiiipt',game.history({ verbose: true }));
      
      setTranscript(prev=>[...prev,game.history({ verbose: true }).pop()])
     
    }

    if (move !== null && piece.length === 2) {
      console.log("moves", sourceSquare, targetSquare);

      

      console.log(game.history({ verbose: true }));
      sendMessage(
        sourceSquare +
          "," +
          targetSquare +
          "," +
          chessStuffCtx.onBoardOrientation
      );
    }

   


    if (game.in_checkmate()) {
      console.log("maaaate");

      if (
        ((game.history({ verbose: true }).length % 2 === 0) &&
        chessStuffCtx.onBoardOrientation === "b") ||
          (!(game.history({ verbose: true }).length % 2 === 0) &&
          chessStuffCtx.onBoardOrientation === "w")) {
            gameResultCall("wins")
        Swal.fire({
          title: 'Congrats!',
          text: 'Winner!',
          imageUrl: CheckMate,
          imageWidth: 426,
          imageHeight: 284,
          imageAlt: 'Victory',
        })
      } else if (/////////////////////////////New Code start
        ((!(game.history({ verbose: true }).length % 2 === 0) &&
        chessStuffCtx.onBoardOrientation === "b") || 
        ((game.history({ verbose: true }).length % 2 === 0) &&
        chessStuffCtx.onBoardOrientation === "w")))
      {
        matingCall();
      }/////////////////////////////New Code end
      
    } else if 
     (checkFlag ===0 && ((game.in_check()  && (game.history({ verbose: true }).length % 2 === 0) &&
      chessStuffCtx.onBoardOrientation === "w") || 
      (game.in_check()  && !(game.history({ verbose: true }).length % 2 === 0) &&
      chessStuffCtx.onBoardOrientation === "b"))) {
        setCheckFlag(1);
        console.log("cheeeeeeeeek");
  
        Swal.fire({
          title: " You are in check!",
          icon: "warning",
  
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: "I see it!",
        });
      }
      
      if(game.game_over()){
        console.log('game over');
        game.reset();
        console.log(game.history({ verbose: true }))
        chessStuffCtx.onSetGameInProgress(false)
    }



    return true;
  }

  const takeAction = (action) => {

    sendChatText(action)

    if(action==="~~~~IGiveUp~~~~") {
      gameResultCall("losses")
      Swal.fire({
        title: 'Better luck next time',
        text: 'Cheer up, you will do better next time',
        showCancelButton: false,
        showConfirmButton:false,
        timer: 2000,
        imageUrl: CheerUp,
        imageWidth: '80%',
        imageHeight: '80%',
        imageAlt: 'Cheer up!',
      }).then(res=> chessStuffCtx.onSetGameInProgress(false))
    }

  }


 
  const displayCaptured = (color, piece) => {
    
    if(color==="w"){
      if(piece==="p"){
        return `♟`
      }
      if(piece==="q"){
        return `♛`
      }
      if(piece==="r"){
        return `♜`
      }
      if(piece==="n"){
        return `♞`
      }
      if(piece==="b"){
        return `♝`
      }
      if(piece==="k"){
        return `♚`
      }
    } else {
      if(piece==="p"){
        return `♙`
      }
      if(piece==="q"){
        return `♕`
      }
      if(piece==="r"){
        return `♖`
      }
      if(piece==="n"){
        return `♘`
      }
      if(piece==="b"){
        return `♗`
      }
      if(piece==="k"){
        return `♔`
      }
    }
   
  }

  function colorBoard(value){
    //console.log(document.getElementById('color').value);
    console.log(value);
    
    const colorChoice = value[0].value;
    var LS, DS = "";  //Light Square, Dark Sqaure
    if(colorChoice === 'default')   { LS = '#F0D9B5';  DS = '#B58863';}
    if(colorChoice === 'red')       { LS = '#f9a4a7';  DS = '#c30007';}
    if(colorChoice === 'orange')    { LS = '#ffb061';  DS = '#e27100';}
    if(colorChoice === 'gold')      { LS = '#f5ef88';  DS = '#ded306';}
    if(colorChoice === 'green')     { LS = '#97dd7b';  DS = '#09a603';}
    if(colorChoice === 'cyan')      { LS = '#77eef4';  DS = '#00bfc9';}
    if(colorChoice === 'blue')      { LS = '#5870fd';  DS = '#1e3ce5';}
    if(colorChoice === 'purple')    { LS = '#9d45f5';  DS = '#52069f';}
    if(colorChoice === 'pink')      { LS = 'pink';  DS = 'hotpink';}
    if(colorChoice === 'modern')    { LS = '#d2d2d2';  DS = '#5e5e5e';}
    setlightSquareColor((lightSquareColor) => (lightSquareColor = LS));
    setdarkSquareColor((darkSquareColor) => (darkSquareColor = DS));
  }

  function colorBoardLight(value){
    console.log(value);
    
    console.log(document.getElementById('colorLight').value);
    const colorChoice = document.getElementById('colorLight').value;
    setlightSquareColor((lightSquareColor) => (lightSquareColor = colorChoice));
  }

  function colorBoardDark(){
    console.log(document.getElementById('colorDark').value);
    const colorChoice = document.getElementById('colorDark').value;
    setdarkSquareColor((darkSquareColor) => (darkSquareColor = colorChoice));
  }

  const customPieces = (value) => {
    const pieces = ['wP', 'wN', 'wB', 'wR', 'wQ', 'wK', 'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'];
  
    const pieceChoice = value[0].value;
    const returnPieces = {};
    var x = 0; var y = '';
    if(pieceChoice === 'alternative'){x=1;y = 'png'}
    if(pieceChoice === 'maestro'){x=2;y = 'svg'}
    pieces.map((p) => {
      returnPieces[p] = ({ squareWidth }) => (
   <img style={{ width: squareWidth, height: squareWidth }} src={`/media`+x+`/${p}.`+y}
         alt={p} />
      );
      return null;
    });
  setPieceStyle((pieceStyle) => (pieceStyle = returnPieces));
  if(pieceChoice === 'default')   setPieceStyle((pieceStyle) => (pieceStyle = ''));
  return returnPieces;
  };

  function getMoveOptions(square) {
    if(game.in_check()){return}

    const moves = game.moves({
      square,
      verbose: true
    });
   
    

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
      return move;
    });

    if (moves.length !== 0) {
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)'
    };
  }
  
    setOptionSquares(newSquares);
  }

  return (


    <div className="chessStuffCont">

      <div className="btnsPannel">
        <div className="turnDiv" onClick={()=>console.log()} style={{
          backgroundColor:turn==="w"?"white":"black"}}>{}</div>
      
        <button onClick={()=>takeAction("~~~~IGiveUp~~~~")}>Give up</button>
        <button onClick={()=>takeAction("~~~~Tie~~~~")}>Offer a tie</button>
        

        <div className="colorPickerCont">

        <label>Change Light <br/> Square Color</label>
        <input id = "colorLight" type = "color" value="#ffffff"
        className="colorButton" style={{backgroundImage:`url(${RainbowBtn})`}}
        onChange={() => colorBoardLight()}>
          </input>

        </div>
        <div className="colorPickerCont">

        <label>Change <span style={{color:'grey'}}>Dark</span> <br/> Square Color</label>
        <input id = "colorDark" type = "color" value="#000000"
        className="colorButton" style={{backgroundImage:`url(${RainbowBtn})`}}
        onChange={() => colorBoardDark()}>
          </input>

        </div>

        

        <Select  
                        style={{color:'grey', transition:'all 0.5s', marginLeft:'-10px'}}
                        options={colorOptions}
                        values={['All']}
                        onChange={(value) => colorBoard(value)}
                          
                        
                      />
        <Select  
                        style={{color:'grey', transition:'all 0.5s', marginLeft:'-10px'}}
                        options={piecesOptions}
                        values={['All']}
                        onChange={(value) => customPieces(value)}
                          
                        
                      />

       
        
      </div>


      

            <Chessboard
              customDarkSquareStyle={{
                backgroundColor: darkSquareColor 
                }}
                customLightSquareStyle={{
                  backgroundColor: lightSquareColor 
                  }}
              ref={boardRef}
             
              position={game.fen()}
              onPieceDrop={onDrop}
              boardOrientation={
                chessStuffCtx.onBoardOrientation === "w" ? "white" : "black"
              }
              onPieceClick={() => console.log("clllllllll")}
              customPieces={pieceStyle}
              onMouseOverSquare={getMoveOptions}
              onMouseOutSquare={setOptionSquares}
              customSquareStyles={{
                ...moveSquares,
                ...optionSquares,
                ...rightClickedSquares
              }}
        
            />


     
              <div style={{display:'flex',flexDirection:'column'}}>
      <div className="transcriptDiv" id='trDiv' >

      <TransitionGroup>

              {
                transcript.map(t=>{

                  if(!t.who){

                    
                  return (

                    <Fade duration={1000} bottom when={turn} appear={true} collapse>
                       
                    <div style={{ display:'flex', position:'relative', marginBottom:'5px',
                    justifyContent:`${t.color===chessStuffCtx.onBoardOrientation?"":"flex-end"}` }}>
      
      
                    {/* <div style={{width:'20px',height:'20px', backgroundColor:'red'}}></div> */}
      
      
                    {t.color===chessStuffCtx.onBoardOrientation?
                        <span className="chatPlayerSpan">
                        {t.color.toUpperCase()}
                      </span>:''
                     }
                      <span style={{position:'absolute', 
                      right: t.color===chessStuffCtx.onBoardOrientation? '':'30px',
                      left: t.color===chessStuffCtx.onBoardOrientation? '30px':'',
                      top:'5px'}}> 
                       {displayCaptured(t.color==="w"?"b":"w",t.piece) } From: { t.from}, To: { t.to} 
                       {t.captured? `, Captured: ${ displayCaptured(t.color,t.captured)}`:''} 
                       {t.san.includes("+")? `, Check! ${t.color==="w"? "♚":"♔"}`:''} 
                       </span>
      
                            {t.color===chessStuffCtx.onBoardOrientation?
                              '':
                              <span className="chatPlayerSpan">
                              {t.color.toUpperCase()}
                            </span>
                            }
      
      
                      </div>
                        
                    </Fade>

                  )
                    
           
                      } else {
    
                       
                        
                        return(

                 <Fade duration={1000} bottom when={chatText.length} appear={true} collapse>
        
                        <div style={{ display:'flex', position:'relative', marginBottom:'5px',
                        justifyContent:`${t.who!==chessStuffCtx.oncurrentOpponent?"":"flex-end"}` }}>
            
            
                        {/* <div style={{width:'20px',height:'20px', backgroundColor:'red'}}></div> */}
            
            
                        
                            
                            {t.who!==chessStuffCtx.oncurrentOpponent?
                 <span data-tip={chessStuffCtx.onloginUserData.name} 
                 data-for='span1'
                 data-offset="{'right':60}"
                  className="chatPlayerSpan" style={{
                              backgroundImage:  `url(${chessStuffCtx.onloginUserData.photoLoc})`  
                             
                            }}>{}
                            
                        <ReactTooltip id='span1' place="right" />
                            </span>:''}

                        
                          <span style={{position:'absolute', 
                          right: t.who!==chessStuffCtx.oncurrentOpponent? '':'30px',
                          left:  t.who!==chessStuffCtx.oncurrentOpponent? '30px':'',
                          top:'5px'}} onMouseOver={()=>setHoverOverMySpan(false)}> 
                           {t.message}
                           </span>
            
                           {t.who!==chessStuffCtx.oncurrentOpponent? "":
                            <span className="chatPlayerSpan"
 data-tip={chessStuffCtx.onAllPlayersArr.filter(p=>p.username===chessStuffCtx.oncurrentOpponent)[0]
        .name}  
        data-for='span2'
        data-offset="{'left':60}" 
                            style={{
                              backgroundImage:  
`url(${chessStuffCtx.onAllPlayersArr.filter(p=>p.username===chessStuffCtx.oncurrentOpponent)[0]
  .photoLoc})`  
                             
                            }} onMouseOver={()=>setHoverOverMySpan(true)} >
          { hoverOverMySpan? <ReactTooltip id="span2" place="left" /> :''  }
                              </span>}
            
            
                          </div>
                            
                        </Fade>

                        )
                        
                      }

                })
            
            
            }

             


    </TransitionGroup>

      </div>
                  <div style={{position:'relative'}}>
                 <div style={{position:'relative'}} className="chatBox">

                <Fade duration={400} bottom opposite when={sendText}>
                 <textarea id="chatText" ref={textAreRef} style={{
                width:'100%',height:'100%'}}
                  placeholder="Type your message..." className="chatBoxText">
                  </textarea>
                  </Fade>

                 </div>
              <button onClick={()=>{
               setSendText(false)
        setTranscript(prev=>[...prev,
    {who: chessStuffCtx.onloginUserData.username, message: textChatArea.value}]);
   
    setTimeout(() => {
      textChatArea.value = ""
    }, 1100);
    
    setTimeout(() => {
      setSendText(true)
    }, 1500);
    
      }} 
                  style={{position:'absolute',top:'50px',
                left:'380px', transition:'all 0.5s'}} >Send</button>
                  </div>
                  </div>

    </div>

  );
}
export default Chessstuff;



/*

 setChatText(prev=>[...prev,
         {who: chessStuffCtx.onloginUserData.username, message: textAreRef.current.value}]);
           setSendChatMes(true)
           setTimeout(() => {
             textAreRef.current.value=""
           }, 700);
           setTimeout(() => {
             setSendChatMes(false)
           }, 1000);

                }
              }} 
                  style={{position:'absolute',top:'0',
                left:'330px'}} >Send</button>
                  </div>
                  </div>

      */

                 
    
             
                
                