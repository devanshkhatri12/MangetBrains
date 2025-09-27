// import { useState } from 'react'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <h1 className='bg-red-500 text-5xl'>Assignment working</h1>
//     </>
//   )
// }

// export default App







import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import TaskDetails from './components/TaskDetails.jsx';
import { AuthContext } from './context/AuthContext.jsx';
import Register from './Pages/Register.jsx';

const App = () => {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/register" element={<Register />}/>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/register" />} />
      <Route path="/task/:id" element={user ? <TaskDetails /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default App;

