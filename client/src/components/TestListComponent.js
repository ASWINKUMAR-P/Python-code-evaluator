import React, { Fragment } from 'react';
import { Navigate, renderMatches, useNavigate } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
import {render} from 'react-dom';
import "./leaderboard.css";
import axios from 'axios'; 
import { useEffect,useState } from 'react'; 
import "../screens/Compiler";


export default function TestListComponent(props)
{

    const navigate= useNavigate();
   
   
  return (
    <div>
        <button type="button" class="report-btn" onClick={()=>{navigate(`/report/${props.testid}`)}}>Report for Test {props.testid}</button>
      
    </div>     

    )
    
}