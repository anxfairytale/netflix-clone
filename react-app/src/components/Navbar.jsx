import React,{useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../styles/logo.png';
import '../styles/NavBar.css';

function Navbar({kids,setKids}) {
    const navigate = useNavigate();
    const [showPassModal,setPassModal]=useState(false);
    const[passphrase,setPassphrase]=useState("")
    const[error,setError]=useState("");
    const [targetPath,setTargetPath]=useState("");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    function protectedNavigate(path){
        if(kids && path!=="/kids"){
            setTargetPath(path);
            setPassModal(true);
            return
        }
        navigate(path);
    }
    function confirmPassPhrase(){
        if(passphrase!="123123"){
            setError("Wrong passphrase. Try again");
            setPassphrase("");
            return;
        }
        setKids(false);
        setPassModal(false);
        setError("")
        navigate(targetPath)
    }
    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    }
    function login(){
        navigate("/login");
    }
    return (
        <section>
        <nav className="navbar">
                <button className="l1"onClick={()=>protectedNavigate('/home')}>Home</button>

                {token && role === "user" && (
                    <button className="l1" onClick={()=>protectedNavigate('/uploads')}>Uploads</button>
                )}
                {token && role === "admin" && (
                    <button className="l1" onClick={()=>protectedNavigate("/admin")}>Admin</button>
                )}
                {token && role==="user" && (
                    <button className="l1" onClick={()=>protectedNavigate("/kids")}>Kids</button>
                )}
                
                    {token && (
                    <button onClick={logout}>
                        Logout
                    </button>)}
                
                    {!token &&(
                        <button onClick={login}>Login</button>
                    )}
        </nav>
        {showPassModal && (
            <div className="modal-backdrop">
                <div className="pass-modal">
                    <h2>Exit Kids Mode?</h2>
                    <p>Enter passphrase to continue.</p>
                    <input type="password" value={passphrase}
                    onChange={(e)=>setPassphrase(e.target.value)} placeholder="Enter the passphrase"/>
                    {error && <p className="pass-error">{error}</p>}
                    <button onClick={confirmPassPhrase}>Continue</button>
                    <button onClick={()=>setPassModal(false)}>Cancel</button>
                </div>
            </div>
        )}
        </section>
    )
}
export default Navbar;