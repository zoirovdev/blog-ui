import { useState } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home.jsx'
import Header from './components/Header.jsx'
import New from './components/New.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Profile from './components/Profile.jsx'


function App() {
  
  return (
    <div className="">
      <Header />
      <Routes>
        <Route path='/' element={<Home/>}/>
	<Route path='/new' element={<New/>}/>
	<Route path='/profile' element={<Profile/>}/>
	<Route path='/signup' element={<Signup/>}/>
	<Route path='/login' element={<Login/>}/>
      </Routes>
    </div>
  )
}

export default App
