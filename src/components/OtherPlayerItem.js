import React, { useState, useContext } from 'react'
import './otherPlayerItem.css'
import ReactTooltip from 'react-tooltip';
import {ChessContext} from '../Context/chess-context'






const OtherPlayerItem = (props) => {

    const otherPlItemCtx = useContext(ChessContext)

    const formulateInvitation = () => {
        otherPlItemCtx.onSetInvitation({
            invitation: "sent",
            recipient: props.otherPlayerData.username,
            sender: otherPlItemCtx.onloginUserData.username

        })
        props.onInvitationClickHandler(props.otherPlayerData.username);

    }
    return (
       
        <div className='otherPWrapper'  >
            <div data-tip="Click to send a play invitation" className='otherPPic'
            data-offset="{'top':20}" 
             style={{backgroundImage:`url(${props.otherPlayerData.photoLoc})`}}
              onClick={formulateInvitation}>

                        {/* New Line */}
                {/* <img  style={{width:'100%', height:'100%', borderRadius:'50%'}}
                 src={props.otherPlayerData.photoLoc} alt="" /> */}
                          {/* New Line */}
             </div>
                <ReactTooltip place="right" type="light"/>
            <div style={{color:'white'}} >
                {props.otherPlayerData.name}
                
                </div>
        </div>
       
    );
};

export default OtherPlayerItem;

