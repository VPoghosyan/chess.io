import React from 'react';
import './logIn.css';
import { useState, useRef, useEffect, useContext } from 'react';
import chessBoard from '../images/chessBoard3.png'
import chessBoard1 from '../images/chessBoardBG.jpg'
import Fade from 'react-reveal/Fade';
import SquareLoader from "react-spinners/SquareLoader";
import {ChessContext} from '../Context/chess-context'
import CircleLoader from 'react-spinners/CircleLoader'




const LogIn = (props) => {

    const [labelClassU, setLabelClassU] = useState("label0")
    const [labelClassP, setLabelClassP] = useState("label0")
    const [labelClassE, setLabelClassE] = useState("label0")
    const [labelClassN, setLabelClassN] = useState("label0")
    const [uNameInp, setUnameInp] = useState("");
    const [passInp, setpassInp] = useState("");
    const [emailInp, setEmailInp] = useState("");
    const [nameInp, setNameInp] = useState("");
    const [newUser, setNewUser] = useState(false)
    const [showSpinner, setShowSpinner] = useState(false)
    const [uNameTaken, setUNameTaken] = useState(false)
    const [emailInv, setEmailInv] = useState(false)
    const [uNameInv, setUNameInv] = useState(false)
    const [passInv, setPassInv] = useState(false)

    const uNameRef = useRef()
    
    const [bgImage, setBgImage] = useState()

    const [inputErrColor, setInputErrColor] = useState('#fff')

    const loadsqSize = newUser? 60:45;

    const loginCtx = useContext(ChessContext)

    let uNameVer = uNameInp.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/gi) && 
              uNameInp.length>5;

    const logInReq = () => {
        setShowSpinner(true)
        if(!uNameInv && !passInv) {
            console.log('sending login req');
            fetch('https://calm-beyond-32997.herokuapp.com/api/users/login',
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  method: "POST",
                  body: JSON.stringify({
                    username: uNameInp,
                    password: passInp,
                    
                  })
            }
            )
        .then( res=> res.json() )
        .then(data=> {
            setTimeout(() => {
                setShowSpinner(false)
            }, 1000);
            if (data.password === passInp && data.username===uNameInp){
                loginCtx.onsetLogInUserData(data)
                loginCtx.onSetLoggedIn(true)
                loginCtx.onsetUNameCtx(uNameInp)
                loginCtx.onsetPassCtx(passInp)
                props.onlogInHandler()
                
            } else {
                setUNameInv(true);
                setPassInv(true);
                setInputErrColor("red")
                loginCtx.onsetPassIsWrong(true)
                    
            }

        })
        .catch(err=> {
            console.log(err)
            setTimeout(() => {
                setShowSpinner(false)
            }, 1000);
            setUNameInv(true);
                setPassInv(true);
                setInputErrColor("red")
                loginCtx.onsetPassIsWrong(true)
        })
        }


      }

    useEffect(()=>{

        const timer = setTimeout(() => {

            if(uNameInp.trim().length !== 0 && newUser &&
        uNameInp ===  uNameRef.current.value) {
            fetch('https://calm-beyond-32997.herokuapp.com/api/users/'+uNameInp)
            .then(res=>res.text())
            .then(data=>{
                console.log(data)
                if(data==="Username exists"){
                    setUNameInv(true)
                    setUNameTaken(true)
                } else {
                    setUNameTaken(false)
                    setUNameInv(!uNameVer)
                }
            })
            .catch(err=>console.log(err))
        }
            
        }, 500);

        return ()=> {
            clearTimeout(timer);
        }

    },[uNameInp])
    

    function submitHanler(evt) {
        console.log('working');
        
       evt.preventDefault()
       
      
    } 
    const style={
        
            backgroundImage: `url(${chessBoard})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            transition:'all 300ms'
   
    }

    const axios = require('axios');
    const signUpCall = (uName,pass,fName,uEmail) => {
        setShowSpinner(true)
        fetch('https://calm-beyond-32997.herokuapp.com/api/users',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              method: "POST",
              body: JSON.stringify({
                username: uName,
                name: fName,
                password: pass,
                email: uEmail
              })
        }
        ).then(function(res){ {
            console.log(res)
            setTimeout(() => {
                setShowSpinner(false)
            }, 1000);
           setNewUser(false)
         }})
        .catch(function(res){ {
            console.log(res)
            setTimeout(() => {
                setShowSpinner(false)
            }, 1000);
        }})
    }
   

    return (
        <>
        <div className='card' style={style}>

            { showSpinner && 
            
                <>
                
                        <div style={{position:'absolute',top:"-70px", 
                    left:"170px"}}>
                        <CircleLoader color={'#55efc4'} loading={true} size={70} />
                    </div>
                    <div style={{position:'absolute',top:"-70px", backgroundColor:'red',
                   
                    right:"170px", transform:'rotateY(180deg)'}}>
                        <CircleLoader color={'#55efc4'} loading={true} size={70} 
                        style={{transform:'rotateX(180deg)'}}/>
                    </div>
                
                </>
            
            }
         
           <form onSubmit={submitHanler}>
        <div className="userBox" >
          <label className={labelClassU} 
          >Username
          

          </label>
          <input  style={{color: inputErrColor}} placeholder= {newUser? "Numbers and letters, min length 6":''}
           type="text" ref={uNameRef}  required onFocus={()=>{ 
               //uncomment after testing
           setLabelClassU("label1")
          setInputErrColor("#fff") 
          
          if(!uNameTaken){
            setUNameInv(false)
          } 
        }} value={uNameInp} onBlur={()=> {
              uNameInp || setLabelClassU("label0")
              //uncomment after testing
              
              
              if(!uNameTaken){
                  console.log(uNameTaken)
                  setUNameInv(!uNameVer)
              }
              !uNameVer && setInputErrColor("red");
            }}
           onChange={(e)=>setUnameInp(e.target.value)}/>
        </div>
            <Fade bottom collapse when={uNameInv} >
                    <div style={{color:'red'}}> {uNameTaken? "Username taken": "Invalid Username"}</div>
                </Fade>


        <div className="userBox">
          <label className={labelClassP}>Password
         

          </label>
          <input style={{color: inputErrColor}}  placeholder= {newUser? "Numbers and letters, min length 6":''}
           type= {newUser? "": "password"}  required onFocus={()=>{
           setLabelClassP("label1")
           setInputErrColor("#fff") 
            setPassInv(false)
        }} value={passInp} onBlur={()=> {
            passInp || setLabelClassP("label0")
            let passVer = passInp.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/gi) && 
            passInp.length>5;

            setPassInv(!passVer)
            !passVer && setInputErrColor("red");
        } }
            onChange={(e)=>setpassInp(e.target.value)} />
        </div>
        <Fade bottom collapse when={passInv} >
                    <div style={{color:'red'}}>Invalid Password</div>
                </Fade>

        <Fade bottom collapse when={newUser}>
            <div className="userBox">
            <label className={labelClassN}>Name
            

            </label>
            <input placeholder='Name can have numbers, Elon Musk approves' style={{color: inputErrColor}}
            onFocus={()=> 
            setLabelClassN("label1")} value={nameInp} onBlur={()=> passInp || setLabelClassN("label0")}
             onChange={(e)=>setNameInp(e.target.value)} />
            </div>
        </Fade>

        <Fade bottom collapse when={newUser}>
            <div className="userBox">
            <label className={labelClassE}>Email
            

            </label>
            <input style={{color: inputErrColor}} placeholder='Valid email'
           onFocus={()=> 
            {
                setLabelClassE("label1");
                setInputErrColor("#fff");
                setEmailInv(false)
        }} value={emailInp} onBlur={()=> {
                passInp || setLabelClassE("label0")
               let emailVer = emailInp.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/gi)
               setEmailInv(!emailVer)
               !emailVer && setInputErrColor("red");
                
            }}
             onChange={(e)=>setEmailInp(e.target.value)} />
            </div>
        </Fade>
                 <Fade bottom collapse when={emailInv}>
                    <div style={{color:'red'}}>Invalid Email</div>
                </Fade>

       

        
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <button className="btn" onClick={logInReq}>Log In</button>
          {!newUser?
          <button className="btn" onClick={(evt)=>{
                 evt.preventDefault()
              setNewUser(true)
            }}>New Player</button>
          :
          <button className="btn" onClick={()=>{
              if(!emailInv && !passInv && !uNameInv && nameInp.length){
                  console.log('submitted?');
                  
                signUpCall(uNameInp,passInp,nameInp,emailInp)
              }
          }}>
              Sign Up</button>
            }

        </div>
        
        </form>
       
         
        
        </div>
        </>
    );
}

export default LogIn;




