import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../styles/logo.png';
import '../styles/NavBar.css';
function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    }
    return (
        <nav>
            <div className="nav-left">
                <img src={logo} className="logo"/>
                {token && <Link className="l1" to="/home">Home</Link>}

                {token && role === "user" && (
                    <Link className="l1" to="/uploads">Uploads</Link>
                )}
                {token && role === "admin" && (
                    <Link className="l1" to="/admin">Admin</Link>
                )}
                <div className="nav-right">
                    {token && (
                    <button onClick={logout}>
                        Logout
                    </button>)}
                </div>
                
            </div>

        </nav>
    )
}
export default Navbar;