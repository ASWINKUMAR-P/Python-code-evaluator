import React, { Fragment } from 'react';
import { Navigate, renderMatches, useNavigate } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
import {render} from 'react-dom';
import axios from 'axios'; 
import "./result.css";
import { useEffect,useState } from 'react'; 


export default function ResultComponent(props)
{

    const navigate= useNavigate();
  return (
        <tbody>
        <tr>
          <td>{props.questnum}</td>
          <td>
            <div class="result-box">{props.passed}</div>
          </td>
          <td>{props.tscore}</td>
        </tr>
        </tbody> 
    )
    
}
