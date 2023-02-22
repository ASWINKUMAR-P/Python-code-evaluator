import React,{useEffect,useRef, useState} from 'react';
import { useCallback } from 'react';
import Webcam from 'react-webcam';
import Axios from 'axios';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';

const videoConstraints={
    width:540,
    facingMode:'environment'
}

const Camera=()=>{
    const webcamRef=useRef(null);
    const[url,setUrl]=useState(null);
    const navigate=useNavigate();
    const params=useParams();
    const token = localStorage.getItem('Token');
    Axios.defaults.headers.common['Authorization'] = token;
    console.log(url);
    const name = params.name;
    var homedata;

    const capturePhoto = useCallback(async()=>{
        const imageSrc=webcamRef.current.getScreenshot();
        setUrl(imageSrc)
        try{
            const result = await Axios.post(`/exe/`, {
                imageSrc,
                name
              });
        if(result.data.status=="success"){
            navigate(`/home/${name}`);
        }
        else{
            alert("Image is not clear");
        }  
        }
        catch (err) {
            console.log(err);
          }
    },[webcamRef])
    const onUserMedia=(e)=>{
        console.log(e);
    }
    return(
        <>
            <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
            onUserMedia={onUserMedia}
            mirrored={true}
            />

            <button onClick={capturePhoto}>Capture</button>
            <button onClick={()=>setUrl(null)}>Refresh</button>

            {url && (
                <div>
                    <img src={url} alt='Screenshot'/>
                </div>
            )}
        </>
    )
}

export default Camera