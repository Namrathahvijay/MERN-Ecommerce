import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import OrderTrack from './pages/OrderTrack'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Landing from './pages/Landing'
import Profile from './pages/Profile'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  const isAuthed = !!token

  return (
    <>
      {isAuthed && <NavBar onLogout={() => { setToken(''); }} />}
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <ToastContainer />
        {isAuthed && <SearchBar />}
        <Routes>
          <Route path='/' element={isAuthed ? <Home /> : <Landing />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login setToken={setToken} initial='Login' />} />
          <Route path='/signup' element={<Login setToken={setToken} initial='Sign Up' />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/orders/:id' element={<OrderTrack />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
        {isAuthed && <Footer />}
      </div>
    </>
  )
}

export default App
