import React from 'react';
import { Navigate, renderMatches, useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { BsFillSunFill } from "react-icons/bs";
import { BsSun } from "react-icons/bs";
import Home from './Home';
import Axios from 'axios';
import axios from 'axios';
import "./login.css";
import { Store } from '../Store';
import { useContext } from 'react';
export default function Login()
{
  const navigate= useNavigate();
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const{state,dispatch}=useContext(Store);
  const submitHandler=async(e)=>{
      e.preventDefault();
      try{
        const {data}=await axios.post('/login/',{
          email,
          password
          });
        console.log(data);
        const [{name:firstname}]=data;
        console.log(firstname);
        localStorage.setItem('userInfo',JSON.stringify(data))
        dispatch({
          type:'ADD_USERINFO',
          payload:{data}
        })
        if(data[0].role==='student'){
          localStorage.setItem('Token',data[0].Token);
          localStorage.setItem('Test',data[0].test);
          if(data[0].status===false){
          navigate(`/verify/${firstname}`);
          }
          else{
            navigate(`/home/${firstname}/result`);
          }
        }
        else if(data[0].role==="admin"){
          console.log(data);
          console.log(data[0]);
          console.log(data[0].Token);
          localStorage.setItem('Token',data[0].Token);
          navigate(`/admin`);
        }
        else{
          window.alert("Invalid Login");
          navigate('/');
        }
        
      }
      catch(err){
        window.alert("Invalid Credentials");
        navigate('/');
        console.log(err);
      }
    }
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    useEffect(() => {
      localStorage.setItem('theme', theme);
      document.body.className = `theme-${theme}`;
    }, [theme]);
    const handleThemeChange = () => {
      setTheme(theme === 'light' ? 'dark' : 'light');
    };
  return (
    <div class="login-content">
    <div class="login-container">
      <h2>Python Evaluator</h2>
      <form onSubmit={submitHandler}>
        <label for="username">Username</label>
        <input type="text" id="username" name="email" placeholder="Enter your username" required onChange={(e)=>setEmail(e.target.value)}></input>
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" required onChange={(e)=>setPassword(e.target.value)}></input>
        <input type="submit" value="Login"></input>
      </form>
    </div>
    </div> 
  )  
}