import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import HomeView from './components/Home/HomeView';
import UploadView from './components/UploadView';
import LoginView from './components/Authentication/LoginView'
import AdminView from './components/AdminView'
import VideoPlayer from "./components/Home/VideoPlayer";
import Navbar from "./components/Navbar";
import ProtectedRoutes from "./components/ProtectedRoutes";
import KidsView from "./components/KidsView";
import LandingPage from "./components/LandingPage";
function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [kids,setKids]=useState(false);
  return (
    <BrowserRouter>
      <Navbar kids={kids} setKids={setKids}/>
      <Routes>
        <Route path="/login" element={
          <LoginView />
        } />
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/home" element={
          <HomeView />
        } />
        <Route path="/kids" element={<KidsView setKids={setKids}/>}/>
        <Route path="/uploads" element={<ProtectedRoutes allowedRole="user">
          <UploadView />
        </ProtectedRoutes>} />
        <Route path="/admin" element={
          <ProtectedRoutes allowedRole="admin">
            <AdminView />
          </ProtectedRoutes>
        } />
        <Route path="/video/:id" element={
          <ProtectedRoutes>
            <VideoPlayer />
          </ProtectedRoutes>} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;