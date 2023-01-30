import React, { Fragment } from 'react';
import { Navigate, renderMatches, useNavigate } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
import {render} from 'react-dom';
import "./leaderboard.css";
import axios from 'axios'; 
import { useEffect,useState } from 'react'; 


export default function OutputComponent(props)
{
  const navigate= useNavigate();
  return (
    <div>
        <div className="test-case">
            <p className="pass">Test case didn't pass</p>
            <div className="input-case">
                <p>Input:</p>
                <p>{props.input}</p>
            </div>
            <div className="input-case">
                <p>Your Output:</p>
                <p>{props.yourOutput}</p>
            </div>
            <div className="input-case highlight">
                <p>Expected Output:</p>
                <p>{props.expectedOutput}</p>
            </div>
        </div>
    </div>   
    )
    
}
