import React, { Fragment } from 'react';
import { Navigate, renderMatches, useNavigate } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
import {render} from 'react-dom';
import "./leaderboard.css";
import axios from 'axios'; 
import { useEffect,useState } from 'react'; 
import "../screens/Compiler";


export default function QuestComponent(props)
{

    const navigate= useNavigate();
   
   
  return (
    <div className="inner-quest">
         <h3 className="sub-quest">{props.quest}</h3>
        <button type="button" class="quest-btn btn btn-danger" style={{width:100,marginRight:20}}onClick={()=>{navigate(`/compiler/${props.id}`)}}>Solve</button>
              
    </div>
    
                    
                
                
           
        

    )
    
}