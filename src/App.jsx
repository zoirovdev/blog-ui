import { useState } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home.jsx'
import Header from './components/Header.jsx'
import New from './components/New.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Profile from './components/Profile.jsx'
import PostEdit from './components/PostEdit.jsx'
import MyPosts from './components/MyPosts.jsx'
import SearchResult from './components/SearchResult.jsx'
import View from './components/View.jsx'
import Sidebar from './components/Sidebar.jsx'
import Account from './components/Account.jsx'



function App() {
  
  return (
    <div className="">
      <Header />
      <Sidebar />
      <Routes>
        <Route path='/' element={<Home/>}/>
	<Route path='/new' element={<New/>}/>
	<Route path='/profile' element={<Profile/>}/>
	<Route path='/signup' element={<Signup/>}/>
	<Route path='/login' element={<Login/>}/>
	<Route path='/edit-post/:id' element={<PostEdit/>}/>
	<Route path='/myposts' element={<MyPosts/>}/>
	<Route path='/search' element={<SearchResult/>}/>
	<Route path='/view/:id' element={<View/>}/>
	<Route path='/account/:username' element={<Account/>}/>
      </Routes>
    </div>
  )
}

export default App
