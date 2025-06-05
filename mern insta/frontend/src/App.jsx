import "./App.css";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<Home />} />

          <Route index element={<Navigate to="profile" />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </>
  );
}

export default App;
