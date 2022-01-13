import React, { useState, useContext, useEffect } from 'react'
import './userI.css'
import {ChessContext} from '../Context/chess-context'
import Fade from 'react-reveal/Fade';
import Uploader from './profilePicUploader'
import OtherPlayersList from './OtherPlayersList';



const UserI = () => {
    const axios = require("axios").default;
    const userICtx = useContext(ChessContext)
    const [removeBlur, setRemoveBlur] = useState(false)
     
    const [picChaged, setPicChanged] = useState('')

    useEffect(()=>{
        if(userICtx.onLoggedIn) {
            setTimeout(() => {
                setRemoveBlur(true)
            }, 7000);
            setPicChanged(userICtx.onloginUserData.photoLoc)
        }
    },[userICtx.onLoggedIn])

  


    return (
        <div className='wrapperCont' >
            <div className='cardWrapper' >
                <div className={`profileCard ${!removeBlur && 'profileCard2'}`}>
                    <div className='profilePicCont' >
                        <div className='imageFrame' 
                        style={{backgroundImage:`url(${picChaged})`}}>
                            <div className='imageOverlay' >
                            <Uploader onSetPicChanged={setPicChanged}/>
                                
                            </div>
                            {/* <img style={{width:'100%', height:'100%', borderRadius:'50%',
                            transition:'all 0.5s'}}
                             src={picChaged} alt="" /> */}

                        </div>
                        <div style={{marginBottom:'10px'}}>
                        {userICtx.onloginUserData.name}
                        </div>
                    </div>
                    <div className='userInfoCont' >
                        <div >Wins: {userICtx.onloginUserData.wins} </div>
                        <div>Losses: {userICtx.onloginUserData.losses}</div>
                        <div>Ties: {userICtx.onloginUserData.ties}</div>
                        <div>Smth else</div>
                        
                    </div>
                    
                        <div className={`blurryOverlay`} 
                        style={{pointerEvents:`${!removeBlur && 'none' }`,
                        top: `${!removeBlur? '0%':'45%' }`,
                        height: `${!removeBlur? '100%':'55%' }` }}>

                        </div>
                    
                </div>


            </div>
               
            <div style={{ }}>
                <div className='usersList' style={{position:'relative', overflow:'hidden',
                width:userICtx.onShowPlayers}}>
                    <div style={{position:'absolute', top:'300px', paddingLeft:'10px',
                height:'100%', }}>

                        <OtherPlayersList/>
                    </div>
                </div>
                

            </div>
                
        </div>
    );
};

export default UserI;

