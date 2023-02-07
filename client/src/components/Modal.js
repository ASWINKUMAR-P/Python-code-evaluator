import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Modal.css";
import { useContext } from "react";
import { Store } from "../Store";
import Axios from "axios";
import axios from "axios";

function Modal({ setOpenModal }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [end, setEnd] = useState("");
  const navigate = useNavigate();
  const name = useState();
  const test = localStorage.getItem("Test");
  const token = localStorage.getItem("Token");
  var data;
  let result;
  function handleChange(event) {
    setEnd(event.target.value);
  }
  function handleSubmit(){

    if (end === "END") {
     
      new Promise((resolve) => {
        
        data=axios.get(`/submit/${test}`,{
          headers:{
            Authorization:`Token ${token}`
          }
        });
        console.log(data);
        ctxDispatch({ type: "DELETE_USERINFO" });
        localStorage.removeItem("userInfo");
        resolve();
      })
      .then(() => {
        
        navigate(`/home/${data.name}/result`);
        
      });
    } else {
      navigate("/compiler");
    }
  }
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="endtest">
          <p>Are you sure?</p>
        </div>
        <div className="title">
          <h4>
            Do you really want to end the test? Code will be evaluated once
            submitted.{" "}
          </h4>
        </div>
        <input
          placeholder="END"
          onChange={handleChange}
          className="modal-input"
        ></input>
        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
