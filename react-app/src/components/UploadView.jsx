import React, { useState } from "react";
import api from "../services/api";
import '../styles/UploadView.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function UploadView() {
    const [formDetails, setFormDetails] = useState({
        title: "",
        description: "",
        genre: ""
    })
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [kid, setKid] = useState(false)
    function handleChange(e) {
        setFormDetails({
            ...formDetails,
            [e.target.name]: e.target.value
        })
    }
    async function uploadMedia(e) {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.entries(formDetails).forEach(([key, value]) => {
                formData.append(key, value);
            })
            formData.append("image", image);
            formData.append("video", video);
            formData.append("forKids", kid)
            const response = await api.post("/image", formData);
            console.log(response.data);
            toast.success("Upload successful");
            setFormDetails({
                title: "",
                description: "",
                genre: "",
                kid: false
            })
            setImage(null);
            setVideo(null);
            setKid("");
        } catch (err) {
            console.log(err.response?.data);
            toast.error(err.response?.data?.message || "Upload Failed");
        }
    }
    return (
        <section className="upload-page">
            <div className="card">
                <h1>Upload Video</h1>
                <form onSubmit={uploadMedia}>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input type="text" required id="title" name="title" value={formDetails.title} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea name="description" required value={formDetails.description} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Thumbnail</label>
                        <input type="file" required accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="file-text" />
                    </div>
                    <div>
                        <label>Video</label>
                        <input type="file" required accept="video/*" onChange={(e) => setVideo(e.target.files[0])} className="file-text" />
                    </div>
                    <div>
                        <label>Genre</label>
                        <select required id="genre" name="genre" value={formDetails.genre} onChange={handleChange}>
                            <option value="" disabled>--Select an option--</option>
                            <option value="flower">Flower</option>
                            <option value="water">Water</option>
                            <option value="food">Food</option>
                            <option value="computer">Computer</option>
                            <option value="butterfly">Butterfly</option>
                            <option value="kids">Kids</option>
                        </select>
                    </div>
                    <div className="kid1">
                        <label>Is this made for kids</label>
                        <input type="radio" name="kid" id="kid" value='true' onChange={(e) => setKid(e.target.value)} /><p>Yes</p>
                        <input type="radio" name="kid" id="kid" value='false' onChange={(e) => setKid(e.target.value)} /><p>No</p>
                    </div>
                    <button type="submit" className="upload-btn">Upload</button>
                </form>

            </div>
        </section>
    )
}
export default UploadView;