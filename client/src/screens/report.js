import React, { Fragment } from 'react';
import { Navigate, renderMatches, useNavigate, useParams } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { useEffect, useState } from 'react';
import './report.css';
import './sidebar.css';
import ReportComponent from '../components/ReportComponent';
//import TestListComponent from '../components/TestListComponent';
import TestListComponent from '../components/TestListComponent';

export default function Report() {

  const params = useParams();
  console.log(params);
  const id = params.id;
  const navigate = useNavigate();
  const [list, setTestlist] = useState([])
  // console.log(report);
  useEffect(() => {

    const fetchData = async () => {
      const result = await axios.get(`/gettest`);
      setTestlist(result.data);
      console.log(result);


    };
    fetchData();
  }, []);
  function logout()
  {
    localStorage.clear()
    navigate("/");
  }

  return (

    <div class="report-container">
      <div class="wrapper">
        <div class="section">
          <div class="top_navbar">
            <h3>Admin Dashboard</h3>
            <li ><Link to='/' onClick={logout} class="admin-logout">Logout</Link></li>
          </div>
        </div>
        <div class="sidebar">
          <div class="profile">
            <p>Python Evaluator</p>
          </div>
          <ul>
            <li>
              <Link to='/admin'>
                <span class="item">Upload Student details</span>
              </Link>
            </li>
            <li>
              <Link to="/test">
                <span class="item">Assign test</span>
              </Link>
            </li>
            <li>
              <Link to="/report" class="active">
                <span class="item">View Report</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="leaderboard">
        <div className="board-container">
          <div class="dropdown">
            <input placeholder="Select Test Report"></input>
            <div class="dropdown-content">
              <div class="dropdown-div">

                {list.map((q) => {
                  console.log(q);
                  return (
                    <TestListComponent
                      testid={q.test}
                    />
                  );
                }
                )}
              </div>
            </div>
          </div>
          <div className="myblock">
            </div>
        </div>
      </div>
    </div>
  )
}