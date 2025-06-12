import { useState } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home.jsx'
import Header from './components/Header.jsx'
import PostCreate from './components/PostCreate.jsx'
import Profile from './components/Profile.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'


function App() {
  
  return (
    <div className="">
      <Header />
      <Routes>
        <Route path='/' element={<Home/>}/>
	<Route path='/create' element={<PostCreate/>}/>
	<Route path='/profile' element={<Profile/>}/>
	<Route path='/signup' element={<Signup/>}/>
	<Route path='/login' element={<Login/>}/>
      </Routes>
    </div>
  )
}

export default App
