import React, { useState, useEffect } from "react";

export const ChessContext = React.createContext();

const ChessContextProvider = (props) => {

    const [loginUserData, setLogInUserData] = useState();
    const [passIsWrong, setPassIsWrong] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)
    const [invitation, setInvitation] = useState({
      invitation: "",
      recipient: "",
      sender: ""
    });
    const [boardOrientation, setBoardOrientation] = useState('')
    const [gameInProgress, setGameInProgress] = useState(false);
    const [uNameCtx, setUNameCtx] = useState()
    const [passCtx, setPassCtx] = useState()

    //////////New Lines
    const [showPlayers, SetShowPlayer] = useState("0")
    /////

    const [currentOpponent, setCurrentOpponent] = useState('')
    const [allPlayersArr, setAllPlayersArr] = useState([])
    

    useEffect(()=>{
        console.log(loginUserData);
        
    },[loginUserData])
    useEffect(()=>{
        console.log('gameInProgress',gameInProgress);
        
    },[gameInProgress])

    useEffect(()=>{

        if(loggedIn) {


          fetch('https://calm-beyond-32997.herokuapp.com/api/users/login',
          {
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                  username: loginUserData.username,
                  password: loginUserData.password,
                  
                })
          })
      .then( res=> res.json() )
      .then(data=> {
        
        setLogInUserData(data)
              
       
      })
      .catch(err=> {
          console.log(err)
      }

      )}

    },[gameInProgress])
  

  return (
    <ChessContext.Provider
      value={{
          onloginUserData: loginUserData,
          onsetLogInUserData: setLogInUserData,
          onpassIsWrong: passIsWrong,
          onsetPassIsWrong: setPassIsWrong,
          onLoggedIn: loggedIn,
          onSetLoggedIn: setLoggedIn,
          onInvitation:invitation,
          onSetInvitation:setInvitation,
          onGameInProgress: gameInProgress,
          onSetGameInProgress: setGameInProgress,
          onBoardOrientation:boardOrientation,
          setSetBoardOrientation:setBoardOrientation,
          oncurrentOpponent: currentOpponent,
          onsetCurrentOpponent: setCurrentOpponent,
          /////new lines
          onShowPlayers: showPlayers,
          onSetShowPlayers: SetShowPlayer,
          onsetUNameCtx: setUNameCtx,
          onuNameCtx: uNameCtx,
          onpassCtx: passCtx,
          onsetPassCtx: setPassCtx,
          ////new lines
          onSetAllPlayersArr:setAllPlayersArr,
          onAllPlayersArr: allPlayersArr,



        
      }}
    >
      {props.children}
    </ChessContext.Provider>
  );
};

export default ChessContextProvider;