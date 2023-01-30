import React, { Fragment } from 'react';
import { Navigate, renderMatches, useNavigate } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
import {render} from 'react-dom';

import axios from 'axios'; 
import { useEffect,useState } from 'react'; 
import LeaderboardComponent from '../components/LeaderboardComponent';
import "./leaderboard.css";
export default function Leaderboard()
{

    const navigate= useNavigate();
    const[leaderboard,setLeaderboard]= useState([])
    useEffect(()=>{

        const fetchData=async()=>{
            const result=await axios.get('/api/users/leaderboard');
            setLeaderboard(result.data);
        
        // e.preventDefault();
        // try{
        //   const quest=await Axios.get('/api/users/quest');
        //   const [questobj]=quest.data;
        //   console.log(quest.data)
        //   console.log(questobj);
        //   setQuestion(quest.data)
         
          
        //    navigate(`/home/${params.name}/quest`);
        // }
        // catch(err){
        //   console.log(err);
        // }
        
      };
      fetchData();
    },[]);
   
  return (
    <div>
    <div className="leaderboard">
      <div className="nav-board">
        <ul>
          <li><a href="profile.html">Profile</a></li>
        {/* <li><a href="/leaderboard">Leaderboard</a></li> */}
        </ul>
      </div>
      <div className="board-container">
        <div className="myblock">
        <table>
          <thead>
            <tr>
            <th>Rank</th>
            <th colspan="2">Name</th>
            <th className="finish-time">Finish Time</th>
            </tr>
          </thead>
{/* <tbody>
  <tr>
    <td>1</td>
    <td>
      <div>
      <img
    src="https://t4.ftcdn.net/jpg/00/65/77/27/240_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"
    alt="car" style={{width:40,borderRadius: 35}}
  />
      <p>{props.name}</p>
      </div>
    </td>
    <td>{props.finishtime}</td>
  </tr>
  </tbody> */}
  {leaderboard.map((q)=>{
                console.log(q);
            return(
                <LeaderboardComponent 
            rank={q.rank}
            name={q.name}
            finishtime={q.finishtime}
            />
            );
        }
        )}
  </table>
</div>
    </div>
</div>
</div> 
    )
}
// {leaderboard.map((q)=>{
//     console.log(q);
// return(
//     <LeaderboardComponent 
// rank={q.rank}
// name={q.name}
// finishtime={q.finishtime}
// />
// );
// }
// )}
