import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import api, { BASE_URL } from "../../services/api";
import '../../styles/LoginView.css'
import ParticleBackground from "../ParticleBackground";
import axios from "axios";
function LoginView() {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)

    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    async function sendOtp() {
        try {
            setErrorMessage("");
            setSuccessMessage("");
            if (!email.includes("@")) {
                setErrorMessage("Enter a valid email first");
                return;
            }
            const response = await axios.post(`${BASE_URL}/auth/send-otp`, { email });
            setSuccessMessage(response.data.message);
            setOtpSent(true);
        } catch (err) {
            setErrorMessage("Failed to send Otp");
        }
    }
    async function verifyOtp() {
        try {
            setErrorMessage("");
            setSuccessMessage("");
            const response = await axios.post(
                `${BASE_URL}/auth/verify-otp`, {
                email, otp
            }
            );
            if (response.data.message === "Success") {
                setEmailVerified(true);
                setSuccessMessage("Email verified successfully");
            }
        } catch (err) {
            setErrorMessage("OTP verification failed");
        }
    }
    async function submit(e) {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        if (!email.includes("@") || password.length < 6) {
            setErrorMessage(
                "Enter a valid email and password of at least 6 characters"
            );
            return;
        }
        if (mode === "signup" && !emailVerified) {
            setErrorMessage("please verify your email before signing up");
            return;
        }
        if (mode === "signup" && name.trim() === "") {
            setErrorMessage("Name is required")
            return;
        }
        const url = mode === 'login' ? `${BASE_URL}/auth/login` : `${BASE_URL}/auth/signup`;
        const body = mode === 'login' ? { email, password } : { name, email, password };
        try {
            const response = await axios.post(url, body);
            console.log(response.data)
            localStorage.setItem("token", response.data.accessToken);
            const payload = JSON.parse(atob(response.data.accessToken.split(".")[1]));
            localStorage.setItem("role", payload.role);
            localStorage.setItem("name", payload.name);
            setSuccessMessage(response.data.message);
            if (payload.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/home");
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || "Something went wrong");
        }
    }
    function switchMode() {
        setMode(mode === 'login' ? 'signup' : 'login');
        setErrorMessage("");
        setSuccessMessage("");
        setOtpSent(false);
        setEmailVerified(false)
    }
    return (
        <section className="login-page">
            <ParticleBackground />
            <div className="card">
                <h1>{mode === 'login' ? "Login" : "Sign Up"}</h1>
                <form onSubmit={submit} className="form">
                    {mode === "signup" && (
                        <div className="form-controls">
                            <label>Name</label>
                            <input type="text"
                                className="input-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="form-controls">
                        <label>Email</label>
                        <div className="otp-row">
                            <input type="email" value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                            {mode === 'signup' && (
                                <button type="button" onClick={sendOtp}>Send OTP</button>
                            )}
                        </div>
                    </div>
                    {otpSent && mode === "signup" && (
                        <div className="form-controls">
                            <label>OTP</label>
                            <div className="otp-row">
                                <input type="password" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                <button type="button" onClick={verifyOtp}>Verify OTP</button>
                            </div>
                        </div>
                    )}
                    {((mode === "signup" && emailVerified) || mode === "login") && (
                        <div className="form-controls">
                            <label>Password</label>
                            <input type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                    <button type="submit">{mode === "login" ? 'Login' : 'Sign Up'}</button>
                    <button type="button" onClick={switchMode}>
                        {mode === "login" ? "Create an account" : "Already have an account?"}
                    </button>
                </form>
            </div>

        </section>
    )
}
export default LoginView;