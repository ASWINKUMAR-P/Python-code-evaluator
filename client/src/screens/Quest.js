import axios from 'axios';
import React from 'react';
import { Navigate, renderMatches, useNavigate ,Link, useParams} from 'react-router-dom';
import { useEffect,useState } from 'react';
import "./quest.css";
import QuestComponent from '../components/QuestComponent';
import { useContext } from 'react';
import { Store } from '../Store';

export default function Quest(props)
{

    const navigate= useNavigate();
    const[question,setQuestion]= useState([]);
    const params=useParams();
    const {state , dispatch:ctxDispatch}=useContext(Store);
    const {userInfo}=state;
    const test = localStorage.getItem('Test');
    const token = localStorage.getItem('Token');
    const name = params.name;
    let questdata;
    const signoutHandler=()=>{
        ctxDispatch({type:'DELETE_USERINFO'});
        localStorage.removeItem('userInfo');
        localStorage.removeItem('Token');       
        window.location.href='/';
    }
    useEffect(()=>{
        const fetchData=async()=>{
          try{
            questdata=await axios.get(`/validate/`,{
              headers:{
                Authorization:`Token ${token}`
              }
            });
            console.log()
            if(questdata.data.name!==name){
              alert("Invalid URL!!!");
              localStorage.clear();
              navigate('/');
            }
          }
          catch(error){
            alert("Please Login First");
            localStorage.clear();
            navigate('/');
          }
        }
        fetchData();
    },[Quest]);
    useEffect(()=>{
        const fetchData=async()=>{
            const result=await axios.get(`/getquestion/${test}/`,{
                headers:{
                    Authorization:`Token ${token}`
                }
            });
            setQuestion(result.data);
        };
        fetchData();
    },[]);

    return (
        <div>
            <div className="quest-container">
                <div class="item quest-header">
                    <h3 class="quest-header">Solved: 0/3</h3>
                    <h3 class="quest-header">{name}</h3>
                    <button class="logout quest-header"onClick={signoutHandler}>Logout</button>
                </div>
                <div className="item content-1">
                    <div className="question-content">
                        <h1>Questions</h1>
                        {
                            question.map((q)=>{
                                console.log(q);
                                return(
                                    <QuestComponent 
                                        quest={q.qname}
                                        id={q.id}
                                     />
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )    
}

