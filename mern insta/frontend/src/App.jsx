// import "./App.css";
// import Signup from "./components/Signup.jsx";
// import Login from "./components/Login";
// import MainLayout from "./components/MainLayout";
// import Home from "./components/Home";
// import Profile from "./components/Profile";
// import { Routes, Route } from "react-router-dom";
// import { Navigate } from "react-router-dom";
// import EditProfile from "./components/EditProfile";
// import ChatPage from "./components/ChatPage";
// import {io} from "socket.io-client";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setSocket } from "./redux/socketSlice";
// import { setOnlineUsers } from "./redux/chatSlice";
// import { setLikeNotification } from "./redux/rtnSlice";

// function App() {
//   const { user } = useSelector(store => store.auth);
//   const { socket } = useSelector(store => store.socketio);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (user) {
//       const socketio = io('http://localhost:8000', {
//         query: {
//           userId: user?._id
//         },
//         transports: ['websocket']
//       });
//       dispatch(setSocket(socketio));

//       //Listen all the events
//       socketio.on('getOnlineUsers', (onlineUsers) => {
//         dispatch(setOnlineUsers(onlineUsers));
//       })

//       socket.on('notification', (notification) => {
//         dispatch(setLikeNotification(notification));
//       })

//       return () => {
//         socketio.close();
//         dispatch(setSocket(null));
//       }
//     } else if(socket) {
//       socket?.close();
//       dispatch(setSocket(null));
//     }
//   },[user, dispatch]);

//   return (
//     <>
//       <Routes>

//         <Route path="/" element={<MainLayout />}>
//           <Route index element={<Navigate to="/home" />} />
//           <Route path="/home" element={<Home />} />

//           <Route index element={<Navigate to="/profile" />} />
//           <Route path="/profile" element={<Profile />} />

//           <Route index element={<Navigate to="/account/edit" />} />
//           <Route path="/account/edit" element={<EditProfile/>} />

//           <Route index element={<Navigate to="/chat" />} />
//           <Route path="/chat" element={<ChatPage/>} />
//         </Route>

//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />

//       </Routes>
//     </>
//   );
// }

// export default App;
import { useEffect } from 'react'
import ChatPage from './components/ChatPage'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'


const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: '/profile/:id',
        element: <ProtectedRoutes> <Profile /></ProtectedRoutes>
      },
      {
        path: '/account/edit',
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      {
        path: '/chat',
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
])

function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
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

      // listen all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App