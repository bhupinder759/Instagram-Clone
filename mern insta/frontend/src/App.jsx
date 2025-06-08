import "./App.css";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import {io} from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";

function App() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      //Listen all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else {
      socketio.close();
      dispatch(setSocket(null));
    }
  },[user, dispatch]);

  return (
    <>
      <Routes>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />

          <Route index element={<Navigate to="/profile" />} />
          <Route path="/profile" element={<Profile />} />

          <Route index element={<Navigate to="/account/edit" />} />
          <Route path="/account/edit" element={<EditProfile/>} />

          <Route index element={<Navigate to="/chat" />} />
          <Route path="/chat" element={<ChatPage/>} />
        </Route>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </>
  );
}

export default App;
