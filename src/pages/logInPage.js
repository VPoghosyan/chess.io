
import './LogInPage.css';
import brightKnight from '../images/brightKnight0.png'
import darkKnight from '../images/darkKnight00.png'
import LogIn from '../components/Login'
import React, { useState, useEffect, useContext } from 'react'
import Zoom from 'react-reveal/Zoom';
import Fade from 'react-reveal/Fade';
import Flip from 'react-reveal/Flip';
import Reveal from 'react-reveal/Reveal';
import Spin from 'react-reveal/Spin';
import darkBrightCombo from '../images/darkBrightCombo1.png'
import Shake from 'react-reveal/Shake';
import {ChessContext} from '../Context/chess-context'


function LogInPage(props) {

  const [leftPosL, setLeftPosL] = useState('0px');
  const [leftPosR, setLeftPosR] = useState('194px');
  
  
  const [knightRotate, setKnightRotate] = useState('rotateX(0deg)')
  const [firstSetOpacity,setFirstSetOpacity] = useState(true)
  const [secondSetOpacity,setsecondSetOpacity] = useState('0')
  
  const [combinedSmaller,setCombinedSmaller] = useState(false)
  const logInPageCtx = useContext(ChessContext);

  const logInHandler = () => {
        
   
        //setKnightRotate(true);
       console.log('logged in');
       
        setsecondSetOpacity('1')
        setTimeout(() => {
          
          //setReleaseHorses(false)
          setFirstSetOpacity(false)
          setKnightRotate('rotateX(180deg)')
        }, 1200);
        setTimeout(() => {
          setLeftPosL('62px')
          setLeftPosR('132px')
          
        }, 1800);
        
        setTimeout(() => {
          props.onsetThirdSetOpacity('1');
          setsecondSetOpacity('0')
          props.onsetShowLogIn(false)
        }, 3400);
        setTimeout(() => {
          props.onsetChangeHeight("125px")
            
        }, 4000);
        setTimeout(() => {
            props.onSetShowNav(true)
            

        }, 4800);
    
}


    


    const combinedSmallerStyle = {
         transform:'scale(0.15)',
        top:'-248%',
        opacity:'0',
        left:'-15%',

    }

  return (
    
    <div className="mainCont" onClick={()=>{
      // setLeftPosL('0px');
      // setLeftPosR('194px')
    }}>
      
         
      <div style={{position:'relative',  height:'300px', width:'400px' }}>
      <Flip left  opposite when={props.onshowLogIn}>
        <div style={{position:'absolute',  top:'10%' }}>

          <LogIn onlogInHandler={logInHandler} />
        </div>
        </Flip>

       {
         firstSetOpacity && 
         <>
                 
               {/* first set of knights */}
                <Zoom left opposite when={props.onreleaseHorses} unmountOnExit={true}>
                <img className='knights' style={{left:'0'}}
                src={brightKnight} alt="" />
              </Zoom>
              

               
              <Zoom right opposite  
              right when={props.onreleaseHorses} unmountOnExit={true}>
                <img className='knights '  style={{left:'194px'}} 
                src={darkKnight} alt="" />
              </Zoom>
              {/* first set of knights */}  
               

         </>
       }

      
              
              {/* second set of white knight */}
        <img className='knights' style={{left:leftPosL, 
         opacity:secondSetOpacity}} src={brightKnight} alt="" /> 
     
        <img className='knights '  style={{left:leftPosR, opacity:secondSetOpacity, 
        transform:knightRotate }} 
          src={darkKnight} alt="" />
        {/* <img style={ combinedSmaller? combinedSmallerStyle: { opacity:thirdSetOpacity } } className='knightsCombo '
          src={darkBrightCombo} alt="" /> */}
        
        {/* second set of white knight */}
       
        
       
   
        </div>
   
    </div>
    
  );
}

export default LogInPage;




