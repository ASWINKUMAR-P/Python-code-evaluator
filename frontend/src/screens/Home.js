import React, { useEffect } from "react";
import {Navigate, redirect, useNavigate, useParams} from "react-router-dom";
import Axios from "axios";
import { useState } from "react";
import Quest from "./Quest";
import axios from "axios";
import "./home.css";
import { Link } from "react-router-dom";


export default  function Home() {
  const params = useParams();
  const navigate = useNavigate();
  const name = params.name;
  const test = localStorage.getItem('Test');
  const token=localStorage.getItem('Token');
  let homedata;
  useEffect(()=>{
    const fetchData=async()=>{
      try{
         homedata=await axios.get(`/validate/`,{
          headers:{
            Authorization:`Token ${token}`
          }
        });
        console.log()
        if(homedata.data.name!==name){
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
  },[Home]);
  const home=async(e)=>{
      e.preventDefault();
      let time = new Date();
      try{
          const result=await Axios.post(`/starttest/`,{
              headers:{
                Authorization:`Token ${token}`
              },
              time,
              name,
              test
          })
          localStorage.setItem('deadline',result.data.deadline);
          navigate(`/home/${name}/quest`);
          console.log(result.data);
      }
      catch(err){
          console.log(err);
      }  
  }
  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.clear();
    };
    return () => {
      window.onbeforeunload = null;
    };
  },[])

  return(
    <div className="home-body">
      <div className="nav-board">
        <ul>
          <li>
            <a>{test}</a>
          </li>
          <li>
            <a>{name}</a>
          </li>
        </ul>
      </div>
      <div className="home-content">
        <div className="heading">
          <h2>Instructions</h2>
        </div>
        <div className="home-box">
          <h3>Duration: 90mins</h3>
          <h3>Questions: 3</h3>
        </div>
        <div className="home-instruction">
          <ul>
            <h4>About the test </h4>
            <li>Language supported for the test is Python.</li>
            <li>Each submission will be tested based on the private test cases.</li>
            <li>The test will be auto-submitted when the time exceeds.</li>
            <li>The results will auto-appear once test is over.</li>
          </ul>
        </div>
        <div className="home-instruction">
          <ul>
            <h4>Before the test </h4>
            <li>Make sure you have stable internet connection.</li>
            <li>Ensure the device is fully charged.</li>
          </ul>
        </div>
        <div className="home-instruction">
          <ul>
            <h4>During the test</h4>
            <li>Keep up with the time.</li>
            <li>Avoid switching tabs on web.</li>
          </ul>
        </div>
        <button className="btn-danger" onClick={home}>Start</button>
      </div>
    </div>
  );
}
