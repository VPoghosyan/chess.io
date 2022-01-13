import React,{useEffect, useContext, useState, useRef} from 'react';
import './OtherPlayersList.css';
import OtherPlayerItem from './OtherPlayerItem';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import {ChessContext} from '../Context/chess-context'
import Swal from 'sweetalert2'
import { TransitionGroup } from "react-transition-group";
import Rotate from 'react-reveal/Rotate';



const OtherPlayersList = () => {

    const otherPlListCtx = useContext(ChessContext)

    let socket = useRef(null)//test

    const playersArr = [
     
      {
          name: "Manny",
          username:'mtorres4444',
          photoLoc: "https://s3.us-east-2.amazonaws.com/chessio.images/7016196.jpg"

      },
      {
          name: "Christian",
          username:'cmills4444',
          photoLoc: "https://s3.us-east-2.amazonaws.com/chessio.images/5358727.jpg"

      },
      
      
  ]

    ////////////////New code start
    const [listOfPlayers, setListOfPlayers] = useState([])

    const playersRef = useRef(listOfPlayers)

  useEffect(()=>{
      fetch('https://calm-beyond-32997.herokuapp.com/api/showall',
      {
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
              username: otherPlListCtx.onuNameCtx,
              password: otherPlListCtx.onpassCtx,
              
            })
      }
      )
      .then(res=>res.json())
      .then(data=> {
        setListOfPlayers(data.filter(u=>u.username!==otherPlListCtx.onloginUserData.username));
        otherPlListCtx.onSetAllPlayersArr(data)
        console.log('playerssssssss',data);
        
      })
      .catch(err=>console.log(err));
  },[otherPlListCtx.onuNameCtx,otherPlListCtx.onpassCtx])
   ////////////////New code end

   
    const [stompClient, setStompClient] = useState(null);
    const invitationClickHandler = (recipient) => {
        sendMessage(recipient, "~~~~letsPlay~~~~")
        setTimeout(() => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Invitation Sent to '+ recipient,
                showConfirmButton: false,
                timer: 2200
              })
        }, 500);
             
    }

    useEffect(()=>{

      let userList = [];

      fetch('https://calm-beyond-32997.herokuapp.com/api/showall',
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
      }
      )
      .then(res=>res.json())
      .then(data=> {
        
        userList=data;
        
      })
      .catch(err=>console.log(err));


        console.log('useeffect ruuuuuuns');
        console.log('useeffect ', otherPlListCtx.onGameInProgress);
        socket.current = new SockJS('https://glacial-lowlands-14052.herokuapp.com/hello')
        setStompClient(Stomp.over( socket.current))
        let stompClient = Stomp.over(socket.current)
        stompClient.connect({username: otherPlListCtx.onloginUserData.username}, function (frame) {
      
        
          stompClient.subscribe('/users/queue/messages', function (greeting) {
            console.log('heeeeeeey ', otherPlListCtx.onGameInProgress);
            // console.log(JSON.parse(greeting.body).text);
            // console.log("From: " + JSON.parse(greeting.body).from);
            const messageReceived = JSON.parse(greeting.body).text;
            const messageSender = JSON.parse(greeting.body).from;
            

                if (messageReceived==="~~~~letsPlay~~~~") {
                  
                  console.log(listOfPlayers);
                  console.log(otherPlListCtx.onAllPlayersArr);
                  console.log(userList);


                  if (otherPlListCtx.onGameInProgress) {
                    console.log('otherPlListCtx.onGameInProgress is ', otherPlListCtx.onGameInProgress);
                    sendMessage(messageSender, "~~~~gameInProgress~~~~")
                    
                } else {
                  
                    Swal.fire({
                        title: 'Hey there!',
                        text: 'An invitation to play from '
                        +userList.filter(u=> u.username===messageSender)[0].name,////New line
                        showCancelButton: true,
                        showConfirmButton:true,
                        confirmButtonText:"Accept",
                        cancelButtonText:'Deny',
                        
                        imageUrl: userList.filter(u=> u.username===messageSender)[0].photoLoc,////New line
                        imageWidth: '80%',
                        imageHeight: '80%',
                        imageAlt: 'Custom image',
                      }).then(res=> {
                          if(res.isConfirmed){
                              
                              stompClient.send("/app/hello/hellouser", {}, JSON.stringify(
                                {from:otherPlListCtx.onloginUserData.username,
                                   to: messageSender,text:"~~~~Iaccept~~~~"}));
                            
                            otherPlListCtx.setSetBoardOrientation("b");
                            otherPlListCtx.onSetGameInProgress(true)
                            console.log('accepted invite');//test
                            otherPlListCtx.onsetCurrentOpponent(messageSender)
                            
    
                          } else if (res.isDenied || res.dismiss) {
                            stompClient.send("/app/hello/hellouser", {}, JSON.stringify(
                                {from:otherPlListCtx.onloginUserData.username,
                                   to: messageSender,text:"~~~~decline~~~~"}));
                                console.log('declined invite');//test
                            
                          }
                      })
                    }
                } else if (messageReceived==="~~~~Iaccept~~~~") {
                  
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Your invitation has been accepted. Good luck!',
                        showConfirmButton: false,
                        timer: 2000
                      }).then(res=>{
                        otherPlListCtx.setSetBoardOrientation("w");
                        otherPlListCtx.onSetGameInProgress(true);
                        otherPlListCtx.onsetCurrentOpponent(messageSender)
                      })
                } else if(messageReceived==="~~~~decline~~~~") {
                    Swal.fire({
                        icon: 'error',
                        title: ' Bummer! ',
                        text: 'Your invitation has been declined :(',
                        showCloseButton: true,
                        showCancelButton: false,
                        focusConfirm: false,
                        confirmButtonText:'OK',
                       
                        
                        confirmButtonText:'OK',
                      })
                } else if(messageReceived=== "~~~~gameInProgress~~~~"){
                    Swal.fire({
                        title: messageSender+" is in a middle of a match",
                        icon: 'info',
                       
                        showCloseButton: true,
                        showCancelButton: false,
                        focusConfirm: false,
                        confirmButtonText:'OK',
                        
                        
                      })
                }
            
            
            
          });

          stompClient.subscribe('/topic/greetings', function (greeting) {
            showGreetingShared(greeting.body);
          });
        })
    
        
        return ()=> stompClient.disconnect()
        
      
      },[])


    

        
const showGreetingShared = (mes) => {
    //setMessagesObj((oldMes)=> [mes,...oldMes]);
    console.log(mes);
    
    
  };
  
  
  function sendMessageShared() {
   
    stompClient.send("/app/hello/helloworld", {}, JSON.stringify({'sharedUMessage': 
    otherPlListCtx.onloginUserData.username+ " is online"}));
    
  }

  function sendMessage(recipient, text) {
  
    
    stompClient.send("/app/hello/hellouser", {}, JSON.stringify(
      {from:otherPlListCtx.onloginUserData.username,
         to: recipient,text:text}));
    
   
  }


      ////////// New Lines below
    return (
      
        <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
              
              <TransitionGroup>

                {listOfPlayers.map(p=> 

                  <Rotate  delay={7300} when={otherPlListCtx.onShowPlayers==="300px"} key={p.username}
                   appear={true} collapse top right >
                    <OtherPlayerItem onInvitationClickHandler={invitationClickHandler}
                    key={p.username} otherPlayerData={p}/>
                  </Rotate >
                    
                    )}

              </TransitionGroup>
          
            
        </div>
       
    );
};

export default OtherPlayersList;