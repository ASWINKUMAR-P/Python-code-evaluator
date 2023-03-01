import React, { useEffect, useState } from "react";
import { Navigate, renderMatches, useNavigate } from "react-router-dom";
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import {render} from 'react-dom';
// import { toast } from 'react-toastify';
import clgicon from "./images/clgicon.png";
import depticon from "./images/depticon.png";
import regnum from "./images/regnum.png";
import "./filter.css";
import "./sidebar.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Axios from "axios";

export default function Filter() {
  //   const[count,setCount]= useState(0);

  const navigate = useNavigate();
  const [testName, settestName] = useState("");
  const [startTime, setstartTime] = useState("");
  const [endTime, setendTime] = useState("");
  const [duration, setDuration] = useState("");

  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedquestions, setSelectedquestions] = useState([]);
  const [selectedstudents, setSelectedstudents] = useState([]);
  var admindata;
  const token = localStorage.getItem("Token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        admindata = await axios.get(`/validateadmin`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      } catch (error) {
        //alert();
        window.alert("Please login with admin credentials!!!");
        localStorage.clear();
        navigate("/");
      }
    };
    fetchData();
  }, []);

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/sendstudent");
      const questionSet = await axios.get("/sendquestion");
      setStudents(result.data);
      setQuestions(questionSet.data);
    };
    fetchData();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await Axios.post(`/createTest/`, {
        testName,
        startTime,
        endTime,
        duration,
        selectedstudents,
        selectedquestions,
      });
      //setStatus(result.data);
      console.log(result.data);
      window.alert("Test created successfully");
    } catch (err) {
      console.log(err);
      window.alert("Process failed!!!");
    }
  };
  const [constraints, setConstraints] = useState({});

  const [levels, setLevels] = useState({ level: "" });

  const filteredStudents = filterStudents(students, constraints);
  const filteredQuestions = filterQuestions(questions, levels);

  function filterStudents(students, constraints) {
    return students.filter((student) => {
      return Object.entries(constraints).every(
        ([key, value]) => student[key] === value
      );
    });
  }

  function filterQuestions(questions, levels) {
    return questions.filter((question) => {
      return Object.entries(levels).every(
        ([key, value]) => question[key] === value
      );
    });
  }

  const handleChangeQuestions = (item) => {
    if (selectedquestions.includes(item)) {
      setSelectedquestions(selectedquestions.filter((i) => i !== item));
    } else {
      setSelectedquestions([...selectedquestions, item]);
    }
  };

  const handleChangeStudents = (item) => {
    if (selectedstudents.includes(item)) {
      setSelectedstudents(selectedstudents.filter((i) => i !== item));
    } else {
      setSelectedstudents([...selectedstudents, item]);
    }
  };
  console.log(selectedquestions);
  console.log(selectedstudents);

  return (
    <div class="dashboard">
      <aside class="search-wrap">
        <div class="search">
          <label for="search">
            <h3>Admin Dashboard</h3>
          </label>
        </div>

        <div class="user-actions">
          Logout
          <button onClick={logout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 21c4.411 0 8-3.589 8-8 0-3.35-2.072-6.221-5-7.411v2.223A6 6 0 0 1 18 13c0 3.309-2.691 6-6 6s-6-2.691-6-6a5.999 5.999 0 0 1 3-5.188V5.589C6.072 6.779 4 9.65 4 13c0 4.411 3.589 8 8 8z" />
              <path d="M11 2h2v10h-2z" />
            </svg>
          </button>
        </div>
      </aside>

      <header class="menu-wrap">
        <figure class="user">
          <h2>Python Evaluator</h2>
        </figure>

        <nav>
          <section class="dicover">
            <h3>Discover</h3>

            <ul>
              <li>
                <Link to="/admin">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.855 14.365l-1.817 6.36a1.001 1.001 0 0 0 1.517 1.106L12 18.202l5.445 3.63a1 1 0 0 0 1.517-1.106l-1.817-6.36 4.48-3.584a1.001 1.001 0 0 0-.461-1.767l-5.497-.916-2.772-5.545c-.34-.678-1.449-.678-1.789 0L8.333 8.098l-5.497.916a1 1 0 0 0-.461 1.767l4.48 3.584zm2.309-4.379c.315-.053.587-.253.73-.539L12 5.236l2.105 4.211c.144.286.415.486.73.539l3.79.632-3.251 2.601a1.003 1.003 0 0 0-.337 1.056l1.253 4.385-3.736-2.491a1 1 0 0 0-1.109-.001l-3.736 2.491 1.253-4.385a1.002 1.002 0 0 0-.337-1.056l-3.251-2.601 3.79-.631z" />
                  </svg>
                  Student details
                </Link>
              </li>

              <li>
                <Link to="/test" class="active">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.353 2.355-6.049-.002-8.416zm-1.412 7.002L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002 1.563 1.571 1.564 4.025.002 5.588z" />
                  </svg>
                  Assign test
                </Link>
              </li>

              <li>
                <Link to="/report">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5.707 19.707L12 13.414l4.461 4.461L14.337 20H20v-5.663l-2.125 2.124L13.414 12l4.461-4.461L20 9.663V4h-5.663l2.124 2.125L12 10.586 5.707 4.293 4.293 5.707 10.586 12l-6.293 6.293z" />
                  </svg>
                  Report
                </Link>
              </li>
            </ul>
          </section>
        </nav>
      </header>

      <div class="content-wrap">
        <form className="filter-content" onSubmit={submitHandler}>
          <div className="filter1">
            <div className="neomorph-container">
              <label className="neomorph-title">Test Name:</label>
              <input
                type="text"
                name="testName"
                className="neomorph-input"
                placeholder="Test name"
                required
                onChange={(e) => settestName(e.target.value)}
              />
              {/* </div>
      <div className="form-group"> */}
              <label className="neomorph-title">Start Time:</label>
              <input
                type="datetime-local"
                className="neomorph-input"
                name="startTime"
                required
                onChange={(e) => setstartTime(e.target.value)}
              />
              {/* </div>
      <div className="form-group"> */}
              <label className="neomorph-title">End Time:</label>
              <input
                type="datetime-local"
                className="neomorph-input"
                name="endTime"
                required
                onChange={(e) => setendTime(e.target.value)}
              />
              {/* </div>
      <div className="form-group"> */}
              <label className="neomorph-title">Duration:</label>
              <input
                type="time"
                className="neomorph-input"
                name="duration"
                placeholder="Duration (in minutes)"
                required
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <button className="filter-btn" type="submit">
              Submit
            </button>
          </div>
          <div className="filter2">
            <div className="neomorph-container">
              <div className="neomorph-filter">
                {/* <label>Filter by college:</label> */}
                <div className="clg-image">
                  <input
                    value={constraints.college}
                    placeholder="filter by college"
                    onChange={(e) =>
                      setConstraints({
                        ...constraints,
                        college: e.target.value,
                      })
                    }
                  />
                  <img src={clgicon}></img>
                </div>
                {/* <div> */}
                {/* <label>Filter by department:</label> */}
                <div className="clg-image">
                  <input
                    value={constraints.department}
                    placeholder="filter by department"
                    onChange={(e) =>
                      setConstraints({
                        ...constraints,
                        department: e.target.value,
                      })
                    }
                  />
                  <img src={depticon}></img>
                </div>
                {/* </div>
    <div> */}
                {/* <label>Filter by Registration Number:</label> */}
                <div className="clg-image">
                  <input
                    value={constraints.regNumb}
                    placeholder="filter by register"
                    onChange={(e) =>
                      setConstraints({
                        ...constraints,
                        regNumb: e.target.value,
                      })
                    }
                  />
                  <img src={regnum}></img>
                </div>
              </div>

              <div className="filter-checkbox">
                <ul className="reg-box">
                  {filteredStudents.map((student) => {
                    return (
                      <label key={student.id}>
                        <input
                          class="dot"
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
              <div class="level">
                <input
                  placeholder="Filter by level:"
                  value={setQuestions.level}
                  onChange={(e) =>
                    setLevels({ ...levels, level: e.target.value })
                  }
                />
              </div>
              <ul>
                {/* {filteredQuestions.map(question=> (
        <li >{question.questdesc}</li>
      ))} */}

                {filteredQuestions.map((q) => {
                  {
                    /* console.log(q); */
                  }
                  return (
                    <label key={q.qnum}>
                      <input
                        className="email-box"
                        type="checkbox"
                        checked={selectedquestions.includes(q)}
                        onChange={() => handleChangeQuestions(q)}
                        // checked={

                        //  selectedquestions.includes(q) ?
                        //  setSelectedquestions(selectedquestions.filter(i =>i !=q))
                        //  : setSelectedquestions([...selectedquestions,q])

                        // }
                      />
                      {q.desc}
                    </label>
                  );
                })}
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
