import React, { useCallback, useEffect, useState, useMemo, useContext } from "react";
import { useDropzone } from "react-dropzone";
import {ChessContext} from '../Context/chess-context'


function DropzoneComponent(props) {
  const [files, setFiles] = useState([]);
  const [imageKey, setImageKey] = useState('');

  const ropZoneCtx = useContext(ChessContext)

  const axios = require("axios").default;
  const API_ENDPOINT = "https://l9r30zqplb.execute-api.us-east-2.amazonaws.com/default/getPresignedImageURL";


  const baseStyle = {
    width:'100%',
    height:'100%',
    borderRadius:'50%',
    alignItems: "center",
    
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "red",
    borderStyle: "dashed",
    backgroundColor: "red",
    color: "#bdbdbd",
    transition: "border .3s ease-in-out",
  };

  const activeStyle = {
    borderColor: "#2196f3",
  };

  const acceptStyle = {
    borderColor: "#00e676",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
  };

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
    handleSubmit(acceptedFiles);
  }, []);


  const handleSubmit = async (files) => {
    const file = files[0];
    console.log(file['file']);
    // * GET request: presignedURL
    const response = await axios({
        method: "GET",
        url: API_ENDPOINT
    });

    console.log("Response: ", response.data);
    // * PUT request: upload file to S3

    const result = await fetch(response.data.uploadURL, {
        method: "PUT",
        headers: {
            "Content-Type": "image/jpeg",
        },
        body: file,
    });

    console.log("Results: ", result);

    const updateInfo = {
            photoLoc: "https://s3.us-east-2.amazonaws.com/chessio.images/" + response.data.Key
    }

    const updatePhotoLoc = fetch("https://calm-beyond-32997.herokuapp.com/api/users/photoloc/"
    +ropZoneCtx.onloginUserData.username, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateInfo)
    }).then(res=> props.onSetPicChanged("https://s3.us-east-2.amazonaws.com/chessio.images/"
     + response.data.Key)).catch(err=>console.log(err)) ;

    console.log("updatePhotoLoc ", updatePhotoLoc);
    setImageKey('');
}
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <img src={file.preview} alt={file.name} />
    </div>
  ));

  // clean up
  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section style={{ borderRadius:'50%',  width:'100%', height:'100%',
    display:'flex', justifyContent:'center', alignItems:'center', fontFamily:'Montserrat',
    transition:'all 1s'}}>
      <div {...getRootProps({})}>
        <input {...getInputProps()} />
        <div>Click to edit</div>
      </div>
    
    </section>
  );
}

export default DropzoneComponent;





































// export default function Uploader(props) {
//     const axios = require("axios").default;
//     const API_ENDPOINT = "https://l9r30zqplb.execute-api.us-east-2.amazonaws.com/default/getPresignedImageURL";
//     const [loading, setLoading] = useState(true);
//     const [data, setData] = useState([]);
//     const [imageKey, setImageKey] = useState('');
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [name, setName] = useState('');
//     const [password, setPassword] = useState('');
//     const [wins, setWins] = useState(0);
//     const [losses, setLosses] = useState(0);
//     const [ties, setTies] = useState(0);

//     const uploaderCtx = useContext(ChessContext)

//     const dropBox = useRef()

    

//     const handleChangeStatus = ({ meta, remove }, status) => {
//       console.log("upload status",status, meta);
//       console.log(uploaderCtx.onloginUserData.username);
      
//     }

//     const handleSubmit = async (files) => {
//         const file = files[0];
//         console.log(file['file']);
//         // * GET request: presignedURL
//         const response = await axios({
//             method: "GET",
//             url: API_ENDPOINT
//         });
 
//         console.log("Response: ", response.data);
//         // * PUT request: upload file to S3



//         const result = () => fetch(response.data.uploadURL, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "image/jpeg",
//             },
//             body: file['file'],
//         }).then(res=> {
//             props.onSetPicChanged(true);
//             updatePhotoLoc()
//         })
//         .catch(err=>console.log(err));

        

//         const updateInfo = {
           
//                 photoLoc: "https://s3.us-east-2.amazonaws.com/chessio.images/" + response.data.Key
//         }

//         const updatePhotoLoc = () => fetch("http://3.129.12.81:9090/api/users/photoloc/"
//         + uploaderCtx.onloginUserData.username, {
//             method: "POST",
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(updateInfo),
//         }).then(res=>console.log(res)).catch(err=>console.log(err))
        
//        result();
//         setImageKey('');
//     }

//     return (
//       <React.Fragment>
        

//         <Dropzone 
            
//             onSetPicChanged={()=>console.log("working")}
           
//             maxFiles={1}
//             multiple={false}
//             canCancel={false}
//             inputContent="Drop A File"
//             autoUpload={true}
            
            
        
//         styles={{
//             dropzone: { width: '100%', height: '100%', borderRadius:'50%',
//         overflow:'hidden' },
//             dropzoneActive: { borderColor: 'green' },
//           }}
//       >
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps({ className: "dropzone" })}>
//             <input {...getInputProps()} />
//             <p>Drag'n'drop images, or click to select files</p>
//           </div>
//         )}
//       </Dropzone>



        
       
//       </React.Fragment>
//     )
//   }
