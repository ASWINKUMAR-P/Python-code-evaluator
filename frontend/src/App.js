import { useEffect,useState } from 'react';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from "./screens/Home.js";
import Login from './screens/Login.js';
import Quest from './screens/Quest.js';
import Admin from './screens/Admin.jsx';
import Filter from './screens/Filter.js';
import axios  from 'axios';
import Axios from 'axios';
import Leaderboard from './screens/Leaderboard.js';
import Result from './screens/Result.js';
import Compiler from './screens/Compiler.js';
import ViewReport from './screens/viewreport.js';
import Report from './screens/report.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/home/:name" element={<Home/>}/>
          <Route path="/home/:name/quest" element={<Quest/>}/>
          <Route path="/home/:name/leaderboard" element={<Leaderboard/>}/>
          <Route path="/home/:name/result" element={<Result/>}/>
          <Route path="/compiler/:id" element={<Compiler/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/test' element={<Filter/>}/>
          <Route path='/report' element={<Report/>}/>
          <Route path='/report/:id'element={<ViewReport/>}/>
          <Route path='/' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
