import React, { Fragment } from 'react';
import { Navigate, renderMatches, useNavigate } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
import {render} from 'react-dom';
import "./leaderboard.css";
import axios from 'axios'; 
import { useEffect,useState } from 'react'; 


export default function ReportComponent(props)
{

    const navigate= useNavigate();
  return (  
<tbody>
  <tr>
    <td>
    <td>{props.rank}</td>
    </td>
    <td>
      <div>
      <img
    src="https://t4.ftcdn.net/jpg/00/65/77/27/240_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"
    alt="car" style={{width:40,borderRadius: 35}}
  />
      <p>{props.name}</p>
      </div>
    </td>
    <td>
    <td>{props.time}</td>
    </td>
    <td>
    <td>{props.score}</td>
    
      
    </td>
  </tr>
  </tbody>     
    )
    
}