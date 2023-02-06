import React, { useState, useEffect, useRef } from "react";

function App() {
  const [timerHours, setTimerHours] = useState();
  const [timerMinutes, setTimerMinutes] = useState();
  const [timerSeconds, setTimerSeconds] = useState();
  const [countDownDate,setCountDownDate]=useState();
  console.log(timerHours);

  let interval= useRef();
  const startTimer = () => {
    const countDownDate = new Date("Feb 3,2023  14:23:00").getTime();
    setCountDownDate(countDownDate);
    interval.current = setInterval(() => {
      const now = new Date().getTime();
      const date=new Date(now);
      console.log(date.getFullYear());
      const distance = countDownDate - now;
      const hours = Math.floor((distance%(24 * 60 * 60 * 1000))/(1000 * 60 * 60));
      const minutes = Math.floor((distance%(60 * 60 * 1000))/(1000 * 60));
      const seconds = Math.floor((distance%(60 * 1000))/1000);
      if (distance < 0) {
        clearInterval(interval.current);
      }else {
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    },1000);
  };
  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  },[countDownDate]);
  return (
    <div className="App">
      <Timer
        timerHours={timerHours}
        timerMinutes={timerMinutes}
        timerSeconds={timerSeconds}
      />
    </div>
  );
}

export default App;