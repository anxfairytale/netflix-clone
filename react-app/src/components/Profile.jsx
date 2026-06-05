import React, { useEffect, useState } from "react";
import { authApi } from "../services/api";
import { toast } from "react-toastify";
import '../styles/Profile.css'
function Profile() {
    const [user, setUser] = useState({});
    const [formDetails, setFormDetails] = useState({
        name: "",
        dob: ""
    });
    const [editing, setEditing] = useState(false);
    const [passphrase,setPassphrase]=useState("");
    async function savePassphrase(e){
        e.preventDefault();
        try{
            const response=await authApi.put("/passphrase",{passphrase});
            toast.success(response.data.message);
            setPassphrase("");
        }catch(err){
            toast.error(err.response?.data?.message||"Failed to save passphrase");
        }
    }
    async function getDetails() {
        try {
            const response = await authApi.get("/profile");
            setUser(response.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load profile");
        }
    }

    function startEditing() {
        setFormDetails({
            name: user.name || "",
            dob: user.dob || ""
        });
        setEditing(true);
    }

    async function editDetails(e) {
        e.preventDefault();

        try {
            const response = await authApi.put("/profile", formDetails);

            setUser(response.data.user);
            setEditing(false);

            toast.success(response.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        }
    }

    function handleChange(e) {
        setFormDetails({
            ...formDetails,
            [e.target.name]: e.target.value
        });
    }

    useEffect(() => {
        getDetails();
    }, []);

    return (
        <section className="profile-page">
            <h1>My Details</h1>

            <div className="user-details">
                <p>User ID: {user.id}</p>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>DOB: {user.dob}</p>
                <p>Role: {user.role}</p>
                <p>Above 18: {user.above18 ? "Yes" : "No"}</p>
            </div>

            {!editing && (
                <button className="edit-btn profile-actions" onClick={startEditing}>Edit</button>
            )}
            {/* {user.above18 && (
                <form onSubmit={savePassphrase} className="profile-form">
                    <h2>Kids Mode PassPhrase</h2>
                    <input type="password" placeholder="Set PassPhrase" value={passphrase} onChange={(e)=>setPassphrase(e.target.value)}/>
                <button className="edit-btn" type="submit">Save Passphrase</button>
                </form>
            )} */}
            {editing && (
                <form className="profile-form" onSubmit={editDetails}>
                    <label>Name</label>
                    <input
                        name="name"
                        type="text"
                        value={formDetails.name}
                        onChange={handleChange}
                    /><br/>

                    <label>DOB</label>
                    <input
                        name="dob"
                        type="date"
                        value={formDetails.dob}
                        onChange={handleChange}
                    />
                    <br/>
                    <div className="profile-actions">
                        <button type="submit">Save</button>
                    <button type="button" className="danger-btn" onClick={() => setEditing(false)}>
                        Cancel
                    </button>
                    </div>
                    
                </form>
            )}
        </section>
    );
}

export default Profile;