import React,{useEffect,useRef, useState} from 'react';
import { useCallback } from 'react';
import Webcam from 'react-webcam';
import Axios from 'axios';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import './result.css';

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
        <div class="verify-page">
            <h2>Identity Verification</h2>
            <div class="line"></div>
            <h4>Please align yourself to the center of the screen and press <span>Capture</span> button</h4>
            <div class="verify-webcam">
                <div class="login-cam">
                    <img src="http://cdn.shopify.com/s/files/1/0587/5597/3311/products/Lifestyleimage1_57e2df1e-ce6c-4962-9dcc-b901c711acf4.jpg?v=1642069051"></img>
                    <span><h3>Do</h3></span>
                    <p>Position at a well lit environment</p>
                </div>
                <div class="dont-img">
                    <img src="https://static01.nyt.com/images/2020/09/29/style/30proctorio1/oakImage-1601396616598-mobileMasterAt3x.jpg"></img>
                    <span><h3>Don't</h3></span>
                    <p>Look away from the screen</p>
                </div>
                <div class="camera">
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/png"
                        videoConstraints={videoConstraints}
                        onUserMedia={onUserMedia}
                        mirrored={true}
                        class="login-img" />
                    <div class="image-btn">
                        <button class="button-29" onClick={capturePhoto}>Capture</button>
                        <button class="button-29" onClick={() => setUrl(null)}>Refresh</button>
                    </div>
                </div>
            </div>

            {url && (
                <div class="screenshot1">
                    <img src={url} alt='Screenshot' />
                </div>
            )}
        </div>
    )
}

export default Camera