import React, { Fragment } from 'react';
import { Navigate, renderMatches, useNavigate } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
import {render} from 'react-dom';
// import "./leaderboard.css";
// import Link from 'react';
// import axios from 'axios'; 
// import "./component.css";
// import { useEffect,useState } from 'react'; 
import { Link } from 'react-router-dom';


export default function QuestionHamburgerComponent(props)
{

    const navigate= useNavigate();
   
   console.log(props.qdisp);
  return (
  
      <Link to={`/compiler/${props.qid}`} className="compiler-quest">{props.qdisp}</Link>    
    )

  }
