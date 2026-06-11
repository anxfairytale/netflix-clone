import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from '../styles/logo.png';
import '../styles/NavBar.css';
import { authApi } from "../services/api";
function Navbar({ kids, setKids }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassModal, setPassModal] = useState(false);
    const [error, setError] = useState("");
    const [targetPath, setTargetPath] = useState("");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const above18 = localStorage.getItem("above18") === "true" || localStorage.getItem("above18") === "1";
    function protectedNavigate(path) {
        if (kids && path !== "/kids") {
            setTargetPath(path);
            setPassModal(true);
            return
        }
        navigate(path);
    }
    function confirmPassPhrase() {
        if (passphrase != "123123") {
            setError("Wrong passphrase. Try again");
            setPassphrase("");
            return;
        }
        setKids(false);
        setPassModal(false);
        setError("")
        setPassphrase("");
        navigate(targetPath)
    }
    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        navigate("/login");
    }
    function login() {
        navigate("/login");
    }
    function cancelPassPhrase() {
        setPassModal(false);
        setPassphrase("");
        setError("");
    }
    return (
        <section>
            <nav className="navbar">
                <h1 className="logo-nav">YouFlicks</h1>
                <div className="nav-links">
                    {above18 && (
                        <a
                            href="/home"
                            className={location.pathname === "/home" ? "active-nav" : ""}
                            onClick={(e)=>{
                                e.preventDefault();
                                protectedNavigate("/home");
                            }}
                        >
                            Home
                        </a>
                    )}

                    {above18 && token && role === "user" && (
                        <a
                            href="/uploads"
                            className={location.pathname === "/uploads" ? "active-nav" : ""}
                            onClick={(e)=>{
                                e.preventDefault();
                                protectedNavigate("/uploads")
                            }}
                        >
                            Upload
                        </a>
                    )}

                    {token && role === "admin" && (
                        <>
                            <a
                            href="/admin"
                            className={location.pathname === "/admin" ? "active-nav" : ""}
                            onClick={(e)=>{
                                e.preventDefault();
                                protectedNavigate("/admin");
                            }}
                        >
                            Approvals
                        </a>
                        <a href="/users"
                        className={location.pathname==="/users"?"active-nav":""}
                        onClick={(e)=>{
                            e.preventDefault();
                            protectedNavigate("/users")
                        }}>Users
                        </a>
                        </>
                    )}

                    {token && role === "user" && !above18 && (
                        <a
                            href="/kids"
                            className={location.pathname === "/kids" ? "active-nav" : ""}
                            onClick={(e)=>{
                                e.preventDefault()
                                protectedNavigate("/kids");
                            }}
                        >
                            Kids
                        </a>
                    )}
                </div>

                {token? (<div className="user-section">
                    <span className="user-tex">Hello, {name}</span>
                    {above18 && role=="user" && (
                        <div>
                              <Link
                        to="/profile"
                        className={location.pathname === "/profile" ? "active-nav" : ""}
                    >
                        Profile
                    </Link>

                    <Link
                        to="/my-images"
                        className={location.pathname === "/my-images" ? "active-nav" : ""}
                    >
                        My Media
                    </Link>
                        </div>
                    )}
                    

                    <button className="btn-signing" onClick={logout}>
                        Logout
                    </button>
                </div>): (<button className="btn-signing" onClick={login}>
    Sign in
  </button> )}
            </nav>
            {showPassModal && (
                <div className="modal-backdrop">
                    <div className="pass-modal">
                        <h2>Exit Kids Mode?</h2>
                        <p>Enter passphrase to continue.</p>
                        <input type="password" value={passphrase}
                            onChange={(e) => setPassphrase(e.target.value)} placeholder="Enter the passphrase" />
                        {error && <p className="pass-error">{error}</p>}
                        <button onClick={confirmPassPhrase}>Continue</button>
                        <button onClick={cancelPassPhrase}>Cancel</button>
                    </div>
                </div>
            )}
        </section>
    )
}
export default Navbar;