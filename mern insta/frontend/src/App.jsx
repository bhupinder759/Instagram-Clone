import './App.css'
import Signup from './components/Signup.jsx'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import { Routes, Route } from 'react-router-dom'
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<MainLayout />}/>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
