
import './App.css';
import brightKnight from './images/brightKnight0.png'
import darkKnight from './images/darkKnight00.png'
import darkBrightCombo from './images/darkBrightCombo1.png'
import LogIn from './components/Login'
import React, { useState, useEffect, useContext } from 'react'
import Zoom from 'react-reveal/Zoom';
import Fade from 'react-reveal/Fade';
import Flip from 'react-reveal/Flip';
import Reveal from 'react-reveal/Reveal';
import Spin from 'react-reveal/Spin';
import LogInPage from './pages/logInPage';
import Chessstuff from './components/chessStuff';
import UserI from './components/UserI'
import {ChessContext} from './Context/chess-context';





function App() {

  const [showNav, setShowNav] = useState(false)
  const [showLogIn, setShowLogIn] = useState(false)
  const [releaseHorses, setReleaseHorses] = useState(false)
  const [changeHeight, setChangeHeight] = useState('50vh')
  const [thirdSetOpacity,setThirdSetOpacity] = useState('0')
  const didHeightChange = changeHeight!=="50vh"? true:false;
  
  const navBox = "10px 15px 55px rgba(0, 136, 255, 0.7)"
  const appCtx = useContext(ChessContext)
 
  return (
    <Fade duration={2000} wait={1500} onReveal={ () => {
      setShowLogIn(true);
      setTimeout(() => {
        setReleaseHorses(true)
      }, 1200);
      }}>
    <div  className='generalWrapper'>
          
         
        

          <div style={{ position:'absolute', width:'100vw',boxShadow: showNav && navBox
        ,height:changeHeight, transition:'all 1s'}} onClick={()=>setChangeHeight("125px")}>
                  <div style={{ width:'100%'
        ,height:'100%',display:'flex',justifyContent:'center', alignItems:'center'}}>
              
              <img  style={{ position:'absolute', height: didHeightChange? "125px":'290px',
              bottom: didHeightChange? "0px":'117px', transition:'all 1s', 
              opacity: thirdSetOpacity}}
                src={darkBrightCombo} alt="" />

                  </div>
          
        </div>
        
         <div className='pages' style={{position:'absolute'}}>
            <LogInPage onSetShowNav={setShowNav} onshowLogIn={showLogIn} onreleaseHorses={releaseHorses}
            onsetShowLogIn={setShowLogIn} 
            onsetChangeHeight={setChangeHeight} onsetThirdSetOpacity={setThirdSetOpacity}/>
         </div>

         <Fade delay={appCtx.onGameInProgress? 500: 5300} bottom opposite 
         when={appCtx.onLoggedIn && !appCtx.onGameInProgress}
          mountOnEnter={true} onReveal={ ()=> setTimeout(() => {
             appCtx.onSetShowPlayers("300px")
          }, 6600)}
         unmountOnExit={true} >
            <div  style={{position:'absolute', width:'100vw', height:'100vh', 
            zIndex: appCtx.onLoggedIn? '1': '-10'}}>
              <UserI/>
            </div>
         </Fade>

          {/* New Lines */}
        <Fade delay={800} bottom opposite when={appCtx.onGameInProgress}
          mountOnEnter={true}
         unmountOnExit={true}>
         <div className='pages' style={{position:'absolute', display:'flex', justifyContent:'center',
        alignItems:'center', zIndex:appCtx.onGameInProgress? '2':'-2'}}>
              <Chessstuff/>
              
              
         </div>
         </Fade>

           
            
                     
         
         
         
      
   
    </div>
    </Fade>
    
  );
}

export default App;




