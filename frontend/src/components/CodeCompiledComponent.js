import React, { Fragment } from 'react';
import { Navigate, renderMatches, useNavigate } from 'react-router-dom';
import {render} from 'react-dom';
import "./leaderboard.css";

import axios from 'axios'; 
import { useEffect,useState } from 'react'; 


export default function OutputComponent(props)
{
  const navigate= useNavigate();
  return (
    <div className="compile-msg">
        <input id="check" type="checkbox"></input>
        <div className="test" onclick="createBalloons(30)">
            <div id="parent">
                <div className="msg">{props.op1}</div>
                <div className="msg">{props.op2}</div>
                <div className="msg">{props.op3}</div>
            </div>
        </div>
    </div>
    ) 
}
