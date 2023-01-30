import React, { Fragment } from 'react';
import { Navigate, renderMatches, useNavigate } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
import {render} from 'react-dom';
import "./leaderboard.css";
import axios from 'axios';
export default function PublicComponent(props)
{
    const navigate= useNavigate();
    return(
        <div>
            <div className="test-case">
            <p className="pass">Test case didn't pass</p>
            <div className="input-case">
                <p><span className="public-case">3/3</span> Public test cases passed</p>
                <p>Private test cases failed <span className="public-case">{props.totaltestcasePassed}</span></p>
            </div>
        </div>
        </div>
    )
}
