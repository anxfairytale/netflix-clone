import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeView from './components/Home/HomeView';
import UploadView from './components/UploadView';
import LoginView from './components/Authentication/LoginView'
import AdminView from './components/AdminView'
import VideoPlayer from "./components/Home/VideoPlayer";
import Navbar from "./components/Navbar";
import ProtectedRoutes from "./components/ProtectedRoutes";
import KidsView from "./components/KidsView";
import LandingPage from "./components/LandingPage";
import MainLayout from "./MainLayout";
import MyImages from "./components/Home/MyImages";
import Profile from "./components/Profile";
function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [kids, setKids] = useState(false);
  return (
    <BrowserRouter>
    <ToastContainer/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginView />} />

        <Route element={<MainLayout kids={kids} setKids={setKids} />}>
          <Route path="/home" element={<HomeView />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/kids" element={<KidsView setKids={setKids} />} />
          <Route
            path="/uploads"
            element={
              <ProtectedRoutes allowedRole="user">
                <UploadView />
              </ProtectedRoutes>
            }
          />
          <Route path="/my-images" element={<ProtectedRoutes allowedRole={"user"}>
            <MyImages/>
          </ProtectedRoutes>}/>
          <Route
            path="/admin"
            element={
              <ProtectedRoutes allowedRole="admin">
                <AdminView />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/video/:id"
            element={
              <ProtectedRoutes>
                <VideoPlayer />
              </ProtectedRoutes>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App;