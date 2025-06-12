import { useState } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home.jsx'
import Header from './components/Header.jsx'

function App() {
  
  return (
    <div className="">
      <Header />
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App
