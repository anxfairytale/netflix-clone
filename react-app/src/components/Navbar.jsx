import React, { useState } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import logo from '../styles/logo.png';
import '../styles/NavBar.css';
import { authApi } from "../services/api";
function Navbar({ kids, setKids }) {
    const navigate = useNavigate();
    const location=useLocation();
    const [showPassModal, setPassModal] = useState(false);
    const [passphrase, setPassphrase] = useState("")
    const [error, setError] = useState("");
    const [targetPath, setTargetPath] = useState("");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const above18=localStorage.getItem("above18")==="true" || localStorage.getItem("above18") === "1";
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
    function cancelPassPhrase(){
        setPassModal(false);
        setPassphrase("");
        setError("");
    }
    return (
        <section>
            <nav className="navbar">
                {above18 && (<button className={`l1 ${location.pathname==="/home"?"active-nav":""}`} onClick={() => protectedNavigate('/home')}>Home</button>)}

                {token && role === "user" && (
                    <button className={`l1 ${location.pathname==="/uploads"?"active-nav":""}`} onClick={() => protectedNavigate('/uploads')}>Uploads</button>
                )}
                {token && role === "admin" && (
                    <button className={`l1 ${location.pathname==="/admin"?"active-nav":""}`} onClick={() => protectedNavigate("/admin")}>Aprrovals</button>
                )}
                {token && role === "user" && !above18 &&(
                    <button className={`l1 ${location.pathname==="/kids"?"active-nav":""}`} onClick={() => protectedNavigate("/kids")}>Kids</button>
                )}
                    {token && (
                        <div className="user-section">
                            <h3 className="name-box">Hello, {name} </h3>
                        <button className={`l1 ${location.pathname==='/profile'?"active-nav":""}` } onClick={()=>protectedNavigate("/profile")}>Profile</button>
                        <button className={`l1 ${location.pathname==="/my-images"?"active-nav":""}`} onClick={()=>protectedNavigate("/my-images")}>My Images</button>
                        <button onClick={logout}>
                            Logout
                        </button>
                        </div>
                        )}

                    {!token && (
                        <button onClick={login}>Login</button>
                    )}

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