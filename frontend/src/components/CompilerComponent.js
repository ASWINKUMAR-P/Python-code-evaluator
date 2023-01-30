import React, { Fragment } from 'react';
import { Navigate, renderMatches, useNavigate } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
import {render} from 'react-dom';
// import "./leaderboard.css";
import axios from 'axios'; 
import { useEffect,useState } from 'react'; 
import "../screens/Compiler";
import "./component.css";


export default function CompilerComponent(props)
{

    const navigate= useNavigate();
   
   
  return (
   
    <div>
    <div>
    <div class="quest-box">
        <h5>Question {props.qnum}</h5>
        <p>{props.questdesc}</p>
    </div>
  </div>
  <diV class="quest-box">
    <div class="quest-content">
      <h5>Sample Input 1</h5>
      <div>
        <p>{props.input1}</p>
      </div>
      <h5>Sample Output 1</h5>
      <div>
        <p>{props.output1}</p>
      </div>
      
      
    </div>
</diV>
<div class="quest-box">
<div class="quest-content">
<h5>Sample Input 2</h5>
      <div>
        <p>{props.input2}</p>
      </div>
      <h5>Sample Output 1</h5>
      <div>
        <p>{props.output2}</p>
      </div>
</div>

  

</div>
  <div class="quest-box">
      <h5>Constraints:</h5>
      <ul>
        <li>{props.constraint1}</li>
        <li>{props.constraint2}</li>
      </ul>
  </div>
  </div>
    )
    
}
