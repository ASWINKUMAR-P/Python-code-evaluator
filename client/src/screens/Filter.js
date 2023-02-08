import React, { useEffect, useState } from 'react';
import { Navigate, renderMatches, useNavigate } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import {render} from 'react-dom';
// import { toast } from 'react-toastify';
import clgicon from './images/clgicon.png';
import depticon from './images/depticon.png';
import regnum from './images/regnum.png';
import './filter.css';
import "./sidebar.css";
import { Link } from "react-router-dom";
import axios from 'axios';
import Axios from 'axios';

export default function Filter() {
  //   const[count,setCount]= useState(0);

  const navigate = useNavigate();
  const [testName, settestName] = useState('');
  const [startTime, setstartTime] = useState('');
  const [endTime, setendTime] = useState('');
  const [duration, setDuration] = useState('');

  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedquestions, setSelectedquestions] = useState([]);
  const [selectedstudents, setSelectedstudents] = useState([]);
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
        //alert();
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

  useEffect(() => {

    const fetchData = async () => {
      const result = await axios.get('/sendstudent');
      const questionSet = await axios.get('/sendquestion');
      setStudents(result.data);
      setQuestions(questionSet.data);
    };
    fetchData();
  }, []);

  const submitHandler=async(e)=>{
    e.preventDefault();
    try
    {
      const result=await Axios.post(`/createTest/`,{
        testName,
        startTime,
        endTime,
        duration,
        selectedstudents,
        selectedquestions,
      })
      //setStatus(result.data);
      console.log(result.data);
      window.alert("Test created successfully");
    }
    catch(err)
    {
        console.log(err);
        window.alert("Process failed!!!");
    }
    
  }
  const [constraints, setConstraints] = useState({});

  const [levels, setLevels] = useState({ level: "" });

  const filteredStudents = filterStudents(students, constraints);
  const filteredQuestions = filterQuestions(questions, levels)

  function filterStudents(students, constraints) {
    return students.filter(student => {
      return Object.entries(constraints).every(([key, value]) => student[key] === value)
    });
  }

  function filterQuestions(questions, levels) {
    return questions.filter(question => {
      return Object.entries(levels).every(([key, value]) => question[key] === value)
    });
  }


  const handleChangeQuestions = (item) => {
    if (selectedquestions.includes(item)) {
      setSelectedquestions(selectedquestions.filter(i => i !== item));
    } else {
      setSelectedquestions([...selectedquestions, item]);
    }
  };


  const handleChangeStudents = (item) => {
    if (selectedstudents.includes(item)) {
      setSelectedstudents(selectedstudents.filter(i => i !== item));
    } else {
      setSelectedstudents([...selectedstudents, item]);
    }
  };
  console.log(selectedquestions);
  console.log(selectedstudents);


  return (
    <div>
    <div class="wrapper">
        <div class="section">
          <div class="top_navbar">
            <h3>Admin Dashboard</h3>
            <li><Link to='/'class="admin-logout" onClick={logout} >Logout</Link></li>
          </div>
        </div>
        <div class="sidebar">
          <div class="profile">
            <p>Python Evaluator</p>
          </div>
          <ul>
            <li>
              <Link to='/admin' >
                <span class="item">Upload Student details</span>
              </Link>
            </li>
            <li>
              <Link to="/test" class="active">
                <span class="item">Assign test</span>
              </Link>
            </li>
            <li>
              <Link to="/report">
                <span class="item">View Report</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    <form className='filter-content'>
      <div className="filter1">
      <div className="neomorph-container">
        <label className="neomorph-title">Test Name:</label>
        <input type="text" name="testName" className="neomorph-input" placeholder="Test name" required onChange={(e) => settestName(e.target.value)} />
      {/* </div>
      <div className="form-group"> */}
        <label className="neomorph-title">Start Time:</label>
        <input type="datetime-local" className="neomorph-input" name="startTime" required onChange={(e) => setstartTime(e.target.value)} />
      {/* </div>
      <div className="form-group"> */}
        <label className="neomorph-title">End Time:</label>
        <input type="datetime-local" className="neomorph-input" name="endTime" required onChange={(e) => setendTime(e.target.value)} />
      {/* </div>
      <div className="form-group"> */}
        <label className="neomorph-title">Duration:</label>
        <input type="time" className="neomorph-input" name="duration" placeholder="Duration (in minutes)" required onChange={(e) => setDuration(e.target.value)} />
      </div>
      <button className="btn btn-danger"type="submit" onClick={submitHandler}>Submit</button>
      </div>
      <div className="filter2">
      <div className="neomorph-container">
      <div className='neomorph-filter'>
        {/* <label>Filter by college:</label> */}
        <div className='clg-image'>
        <input value={constraints.college} placeholder="filter by college" onChange={(e) => setConstraints({ ...constraints, college: e.target.value })} />
        <img src={clgicon} ></img>
        </div>
    {/* <div> */}
        {/* <label>Filter by department:</label> */}
        <div className='clg-image'>
        <input value={constraints.department} placeholder="filter by department" onChange={(e) => setConstraints({ ...constraints, department: e.target.value })} />
        <img src={depticon} ></img>
        </div>
        {/* </div>
    <div> */}
        {/* <label>Filter by Registration Number:</label> */}
        <div className='clg-image'>
        <input value={constraints.regNumb} placeholder="filter by register number" onChange={(e) => setConstraints({ ...constraints, regNumb: e.target.value })} />
        <img src={regnum} ></img>
        </div>
      </div>
    
      <div className="filter-checkbox">
      <ul className="reg-box">
        {filteredStudents.map(student => {
          return (
            <label key={student.id}>
              <input
                type="checkbox"
                checked={selectedstudents.includes(student)}
                onChange={() => handleChangeStudents(student)}
              />
              {student.registernumber}
            </label>
            
          );
        })}
      </ul>
      </div>
      <div>
        <label>Filter by level:</label>
        <input value={setQuestions.level} onChange={(e) => setLevels({ ...levels, level: e.target.value })} />
      </div>
      <ul>

        {filteredQuestions.map((q) => {
          return (

            <label key={q.qnum}>
              <input
                className="email-box" type="checkbox"
                checked={selectedquestions.includes(q)}
                onChange={() => handleChangeQuestions(q)}
              />
              {q.desc}
            </label>

          );
        }
        )}
      </ul>
   </div>
    
   </div>
   </form>
   </div>
  
  )

}