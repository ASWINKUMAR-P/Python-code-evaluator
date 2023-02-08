import React, { useContext, useRef } from 'react';
import { Navigate, renderMatches, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { render } from 'react-dom';
import "./compiler.css";
import { Link } from 'react-router-dom';
import CompilerComponent from '../components/CompilerComponent';
import OutputComponent from '../components/OutputComponent';
import CodeCompiledComponent from '../components/CodeCompiledComponent';
import PublicComponent from '../components/PublicComponent';
import { Store } from '../Store';
import Modal from '../components/Modal';
import QuestionHamburgerComponent from '../components/QuestionHamburgerComponent';

function useWarningCount() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [warningCount, setWarningCount] = useState(() => {
    const count = Number(localStorage.getItem('warningCount'))
    return count > 0 ? count : 0
  });

  useEffect(() => {
    const test = localStorage.getItem('Test');
    localStorage.setItem('warningCount', warningCount);
    if (warningCount >= 3) {
      window.alert("You have exceeded the number of attempts.");
      ctxDispatch({ type: 'DELETE_USERINFO' });
      localStorage.setItem('warningCount', 1);
      const data=axios.get(`/submit/${test}`,{
        headers:{
          Authorization:`Token ${localStorage.getItem("Token")}`
        }
      });
      navigate(`/home/${data.name}/result`);
    }
  },[warningCount]);
  return [warningCount, setWarningCount];
}

function Compiler() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [compile, setCompile] = useState([])
  const params = useParams()
  const id = params.id;
  const [warnings, setWarnings] = useState(0);
  const [code, setCode] = useState([]);
  const [output, setOutput] = useState([])
  const [question, setQuestion] = useState([]);
  const [name, setName] = useState([]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const test = localStorage.getItem('Test');
  const token = localStorage.getItem('Token');
  const deadline = localStorage.getItem('deadline');
  const [timerHours, setTimerHours] = useState();
  const [timerMinutes, setTimerMinutes] = useState();
  const [timerSeconds, setTimerSeconds] = useState();
  const [countDownDate, setCountDownDate] = useState();
  console.log(timerHours);
  let interval = useRef();
  let time;
  let compiledata;

  const startTimer = () => {
    setCountDownDate(deadline);
    interval.current = setInterval(() => {
      const now = new Date().getTime();
      console.log(countDownDate);
      const distance = countDownDate - now;
      console.log(now);
      console.log(distance)
      //console.log(distance);
      const hours = Math.floor((distance % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (60 * 60 * 1000)) / (1000 * 60));
      const seconds = Math.floor((distance % (60 * 1000)) / 1000);
      if (distance < 0) {
        clearInterval(interval.current);
        const data=axios.get(`/submit/${test}`,{
          headers:{
            Authorization:`Token ${token}`
          }
        });
        window.alert("Time Up");
        navigate(`/home/${data.name}/result`);
      } else {
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  }, [countDownDate]);

  useEffect(()=>{
    const fetchData=async()=>{
      try{
        compiledata=await axios.get(`/validate/`,{
          headers:{
            Authorization:`Token ${token}`
          }
        });
        setName(compiledata.data.name);
      }
      catch(error){
        alert("Please Login First");
        localStorage.clear();
        navigate('/');
      }
    }
    fetchData();
  },[]);

  const signoutHandler = () => {
    ctxDispatch({ type: 'DELETE_USERINFO' });
    localStorage.clear();
    window.location.href = '/';
  }
  const getLocalCode = () => {
    let tempcode = localStorage.getItem('tempcode');
    console.log(tempcode)
    if (tempcode) {
      return JSON.parse(localStorage.getItem('tempcode'));
    }
    else {
      return (' ');
    }
  }
  const [tempcode, settempCode] = useState(getLocalCode())
  function handleSaveCode() {
    localStorage.setItem('tempcode', JSON.stringify(tempcode));
  }
  useEffect(() => {
    localStorage.setItem('tempcode', JSON.stringify(tempcode));
  },[tempcode])
  useEffect(() => {
    window.addEventListener('beforeunload', handleSaveCode);
    return () => {
      window.removeEventListener('beforeunload', handleSaveCode);
    }
  },[tempcode]);
 
  console.log(tempcode);
  const [warningCount, setWarningCount] = useWarningCount();
  
  const submitHandler = async (e) => {
    e.preventDefault();
    const {tempcode:code}=tempcode;
    try{
      const result = await Axios.post(`/execute/`, {
        code,
        test,
        name,
        id,
      })
      console.log(code)
      setOutput(result.data);
      console.log(result.data.output);
    }
    catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        setWarningCount(warningCount + 1);
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [warningCount]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/question/${test}/${id}`);
      const resultquest = await axios.get(`/getquestion/${test}`);
      setCompile(result.data);
      setQuestion(resultquest.data);
    }; 
    fetchData();
    //startTimer();
  },[id],[warnings]);

  console.log(question);
  return (
    <div class="wrapper">
      <div class="section">
        <div class="topnav">
          <div className="logout-div">
            <a href="#home" class="active">Python Evaluator</a>
            <button class="logout logout-header" onClick={signoutHandler}>Logout</button>
          </div>
          <div id="myLinks">
            {question.map((q)=>{
              console.log(q.quest);
              return(
                <QuestionHamburgerComponent
                  qdisp={q.qname}
                  qid={q.id}
                />
              ) 
            })}
          </div>
          <a href="javascript:void(0);" class="icon" onclick="myFunction()">
            <button onClick={window['myFunction']}><i class="fa fa-bars"></i></button>
          </a>
          {modalOpen && <Modal setOpenModal={setModalOpen} />}
        </div>
      </div>
      <div class="row">
        <div class="column quest1">
          {compile.map((q) => {
            console.log(q);
            return (
              <CompilerComponent
                qnum={q.id}
                questdesc={q.desc}
                input1={q.testcaseinput1}
                output1={q.testcaseoutput1}
                input2={q.testcaseinput2}
                output2={q.testcaseoutput2}
                constraint1={q.const1}
                constraint2={q.const2}
              />
            );
          }
          )}
        </div>
        <div class="column" >
          <center id="icon-time">
            <i class="fas fa-tachometer-alt" id="icon-space"></i>
            <div class="mobile-container">
            <i class='fas fa-exclamation-triangle'><p className="warning-count">Warning count: {warningCount}</p></i>
              <div id="clockdiv">
                <div className="inner-clock">
                  <span className="hours" id="hour">{timerHours}</span>
                  <h3 className="timer-para">:</h3>
                </div>
                <div className="inner-clock">
                  <span className="minutes" id="minute">{timerMinutes}</span>
                  <h3 className="timer-para">:</h3>
                </div>
                <div className="inner-clock">
                  <span className="seconds" id="second">{timerSeconds}</span>
                </div>
              </div>
              <div className="end-test">
                <button
                  className="openModalBtn"
                  onClick={() => {
                    setModalOpen(true);
                  }}
                >
                  End Test
                </button>
              </div>
            </div>
          </center>
          <form onSubmit={submitHandler}>
            <div class="container" >
              <div class="wrap">
                <textarea
                  value={tempcode.tempcode}
                  onChange={(e) => {
                    settempCode(
                      {
                        ...tempcode,
                        tempcode: e.target.value
                      });
                  }}
                  spellcheck="false" placeholder="write your code here..." required></textarea>
              </div>

            </div>
            <div class="col">
              <div id="button">
                <button className="btn btn-success">Save</button>
                <button className="btn btn-success">Run</button>
                <br />
                <button class="btn btn-success" type="submit">Submit</button>
                <br />
                <pre id="ans"></pre>
              </div>
            </div>
          </form>
          {output.map((q)=>{
              if(q.status=="public")
              {return(
                <OutputComponent
                input={q.input}
                yourOutput={q.useroutput}
                expectedOutput={q.expectedoutput}
                />
              )}
              else if(q.status=="private")
              {
                return(
                  <PublicComponent
                  score={q.score}
                  />
                )
              }
              else if(q.status=="passed"){
                return(
                  <CodeCompiledComponent
                  op1={q.op1}
                  op2={q.op2}
                  op3={q.op3}
                  />
                )
              }
            })}
        </div>
      </div>
    </div>
  )
}

export default Compiler;
