import React, { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Axios from 'axios';
import { useState } from 'react';
// import Quest from "./Quest";
import excelformat from './images/excelformat.jpg';
import excelicon from './images/excelicon.jpg';
import excelfile from './images/excelfile.jpg';
import axios from "axios";
import "./home.css";
import "./admin.css";
import { Link } from "react-router-dom";
import XLSX from 'xlsx';
export default function Admin() {

  const params = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState()
  const [StudentjsonData, setStudentjsonData] = useState('');
  const [QuestionjsonData, setQuestionjsonData] = useState('');
  var admindata;
  const token = localStorage.getItem("Token");

  useEffect(()=>{
    const fetchData=async()=>{
      try{
          admindata=await axios.get(`/validateadmin`,{
          headers:{
            Authorization:`Token ${token}`
          }
        });
      }
      catch(error){
        //alert("Please login with admin credentials!!!");
        window.alert("Please login with admin credentials!!!");
        localStorage.clear();
        navigate('/');
      }
    }
    fetchData();
  },[]);

  function logout()
  {
    localStorage.clear()
    navigate("/");
  }

  const studentSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await Axios.post(`/createStudent/`, {
        StudentjsonData,
      })
      console.log(StudentjsonData);
      window.alert("Data updated successfully!!!");
    }
    catch (err) {
      
      window.alert("Enter valid file with valid data");
      console.log(err);
    }
  }
  const questionSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await Axios.post(`/createQuestion/`, {
        QuestionjsonData,
      })
      //setStatus(result.data);
      console.log(QuestionjsonData);
      window.alert("Data updated successfully!!!");
    }
    catch (err) {
      window.alert("Enter valid file with valid data");
      console.log(err);
    }
  }
  const [StudentfileName, setStudentfileName] = useState(null);
  const [QuestionfileName,setQuestionfileName]=useState(null);
  const handleStudentFile = async (e) => {

    console.log(e.target.files[0]);
    const file = e.target.files[0];
    setStudentfileName(file.name)
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(jsonData);
    setStudentjsonData(jsonData);
    // console.log(jsonData);
  };
  const handleQuestionFile = async (e) => {

    console.log(e.target.files[0]);
    const file = e.target.files[0];
    setQuestionfileName(file.name)
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(jsonData);
    setQuestionjsonData(jsonData);
    // console.log(jsonData);
  };

  return (
    <div>
      <div class="wrapper">
        <div class="section">
          <div class="top_navbar">
            <h3>Admin Dashboard</h3>
            <li><Link to='/' class="admin-logout" onClick={logout} >Logout</Link></li>
          </div>
        </div>
        <div class="sidebar">
          <div class="profile">
            <p>Python Evaluator</p>
          </div>
          <ul>
            <li>
              <Link to='/admin' class="active">
                <span class="item">Upload Student details</span>
              </Link>
            </li>
            <li>
              <Link to="/test">
                <span class="item">Assign test</span>
              </Link>
            </li>
            <li>
              <Link to="/report">
                <span class="item">
                View Report
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <form>
        <div className="admin"><form>
            <div className="excel-icon">
              <img src={excelicon}></img>
              <form>
              <div className="excelfile">
                <h3>Student Details</h3>
                {StudentfileName && (
                  <p>fileName:<span>{StudentfileName}</span></p>
                )}
                <input type="file" onChange={(e) => handleStudentFile(e)} />
                <button class="details-btn" type="submit" onClick={studentSubmitHandler}>Submit</button>
              </div>
              </form>
              <form>
              <div className="excelfile">
                <h3>QuestionsUpload</h3>
                {QuestionfileName && (
                  <p>fileName:<span>{QuestionfileName}</span></p>
                )}
                <input type="file" onChange={(e) => handleQuestionFile(e)} />
                <button class="details-btn" type="submit" onClick={questionSubmitHandler}>Submit</button>
              </div>
              </form>
            </div>
          </form>
          </div>
        <div className="file-div">
          <div className="excel-format">
            <h3>Excel File Format Description:</h3>
            <ul>
              <li>
                1. The file should consists of six fields namely name,register number,college,year,department,email.
              </li>
              <li>
                2. Maximum size of the file is 500KB.
              </li>
              <li>
                3. Use the sample as the reference to create the excel file.
              </li>
              <li>
                4. Click <a href="https://docs.google.com/spreadsheets/d/1lVpQkDYpRxAU9aUP90fBqWYgxpQuq-7I/export?format=xlsx">here</a> to download the sample file.
              </li>
            </ul>
          </div>
          <div className="excel-format">
            <h3>Excel File Format Description:</h3>
            <ul>
              <li>
                1. The file should consists of question name, description, constraints, 3 public test cases and 7 private test cases along with 3 special test cases.
              </li>
              <li>
                2. Maximum size of the file is 500KB.
              </li>
              <li>
                3. Use the sample as the reference to create the excel file.
              </li>
              <li>
                4. Click <a href="https://docs.google.com/spreadsheets/d/1sAIYEn73HitygqFSb9fNRzFnV4QFgaM6/export?format=xlsx">here</a> to download the sample file.
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  )
}