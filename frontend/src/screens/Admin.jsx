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
  // const[testName,settestName]=useState('');
  // const[startTime,setstartTime]=useState('');
  // const[endTime,setendTime]=useState('');
  // const[duration,setDuration]=useState('');

  const [jsonData, setjsonData] = useState('');
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await Axios.post(`/sendstudent/`, {
        jsonData
      })
      setStatus(result.data);
      console.log(jsonData);
    }
    catch (err) {
      console.log(err);
    }

  }


  const [items, setEmail] = useState([])
  // const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {

    const fetchData = async () => {
      const result = await axios.get('/sendstudent/');
      setEmail(result.data);



    };
    fetchData();
  }, []);
  // console.log(items);

  // const [selectedItems, setSelectedItems] = useState([]);

  // const handleChange = (item) => {
  //   if (selectedItems.includes(item)) {
  //     setSelectedItems(selectedItems.filter(i => i !== item));
  //   } else {
  //     setSelectedItems([...selectedItems, item]);
  //   }
  // };

  //console.log(selectedItems);

  const [fileName, setfileName] = useState(null);
  const handleFile = async (e) => {

    console.log(e.target.files[0]);
    const file = e.target.files[0];
    setfileName(file.name)
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(jsonData);
    setjsonData(jsonData);
    // console.log(jsonData);
  };
  console.log(jsonData);


  // console.log(selectedItems);


  return (
    <div>
      <div class="wrapper">
        <div class="section">
          <div class="top_navbar">
            <h3>Admin Dashboard</h3>
          </div>
        </div>
        <div class="sidebar">
          <div class="profile">
            <p>Python Evaluator</p>
          </div>
          <ul>
            <li>
              <Link to='/Admin' class="active">
                <span class="item">Upload Student details</span>
              </Link>
            </li>
            <li>
              <Link to="/Filter">
                <span class="item">Assign test</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/Filter">
                <span class="item">Questions Excel</span>
              </Link>
            </li> */}
            {/* <Admin /> */}
          </ul>
        </div>
      </div>
      <form onSubmit={submitHandler}>
        {/* <div className="nav-admin"> */}
        {/* <p className="admin-header">Admin Dashboard</p> */}
        {/* </div> */}
        <div className="admin">
          {/* <div class="admin-form"> */}
          <form>
            <div className="excel-icon">
              <img src={excelicon}></img>
              <div className="excelfile">
                <h3>Student Details</h3>
                {fileName && (
                  <p>fileName:<span>{fileName}</span></p>
                )}
                <input type="file" onChange={(e) => handleFile(e)} />
                <button class="details-btn">Submit</button>
              </div>
              <div className="excelfile">
                <h3>QuestionsUpload</h3>
                {fileName && (
                  <p>fileName:<span>{fileName}</span></p>
                )}
                <input type="file" onChange={(e) => handleFile(e)} />
                <button class="details-btn">Submit</button>
              </div>
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
                3. Students of registered college can use this platform.
              </li>
              <li>
                4. Email id must be valid.
              </li>
              <li>
              </li>
              <li>
                Click <a href="https://docs.google.com/spreadsheets/d/1lVpQkDYpRxAU9aUP90fBqWYgxpQuq-7I/export?format=xlsx" download>here</a> to download the sample excel file.
              </li>
            </ul>
          </div>
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
                3. Students of registered college can use this platform.
              </li>
              <li>
                4. Email id must be valid.
              </li>
              <li>
              </li>
              <li>
              Click <a href="https://docs.google.com/spreadsheets/d/1sAIYEn73HitygqFSb9fNRzFnV4QFgaM6/export?format=xlsx" download>here</a> to download the sample excel file.
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  )
}
