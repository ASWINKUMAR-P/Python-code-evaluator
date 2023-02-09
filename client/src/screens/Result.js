import React, { Fragment } from 'react';
import { Navigate, renderMatches, useNavigate, useParams } from 'react-router-dom';
import {render} from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import { useEffect,useState } from 'react'; 
import ResultComponent from '../components/ResultComponent';


export default function Result()
{

    const navigate= useNavigate();
    const[result,setResult]= useState([]);
    const test = localStorage.getItem('Test');
    const token=localStorage.getItem('Token');
    const [name,setName]=useState([]);
    var resultdata='';

    useEffect(()=>{
      const fetchData=async()=>{
        try{
           resultdata=await axios.get(`/validate/`,{
            headers:{
              authorization:`Token ${token}`
            }
          });
          setName(resultdata.data.name);
        }
        catch(error){
          window.alert("Invalid request!!!");
          console.log(error);
          navigate('/');
        }
      }
      fetchData();
    },);
    useEffect(()=>{
        const fetchData=async()=>{
            const result=await axios.get(`/result/${test}/`,{
              headers:{
                authorization:`Token ${token}`
              },
              test,              
            });
            setResult(result.data);
      };
      fetchData();
    },[test,name]);
    const res=result.slice(1,4);
    const times=result.slice(0,1);
    function logout()
    {
      localStorage.clear()
      navigate("/");
    }
  return (
    <div className="nav-board">
    <ul>
        <li><Link to="/" onClick={logout}class="admin-logout log">Logout</Link></li>
        <li class="admin-logout">{test}</li>
    </ul>
<div className="result-block" style={{display:'flex'}}>
<div class="myblock1">
<h2>{name}</h2>
{times.map((q)=>{
    return(
      <div>
      <p className="timeDiv1">Total time: {q.time}</p>
      <p className="timeDiv1">Alloted time: {q.ttime}</p>
      </div>
    )
  })}
<table>
<thead>
  <tr>
    <th>Questions</th>
    <th>Passed Testcases</th>
    <th>Score</th>
  </tr>
</thead>
 {res.map((q)=>{
     console.log(q);
 return(
     <ResultComponent
 questnum={q.id}
 passed={q.score}
  score={q.tscore}
 />
 );
 }
 )}
  </table>
</div>
</div>
</div>
    ) 
}
