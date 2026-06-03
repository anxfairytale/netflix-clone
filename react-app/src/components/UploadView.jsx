import React, { useState } from "react";
import api from "../services/api";
import '../styles/UploadView.css'
function UploadView() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [genre, setGenre] = useState('');
    const [kid, setKid] = useState(false)
    async function uploadMedia(e) {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("image", image);
            formData.append("video", video);
            formData.append("genre",genre);
            formData.append("forKids",kid)
            const response = await api.post("/image", formData);
            console.log(response.data);
            alert("Upload successful");
            setTitle("");
            setDescription("");
            setImage(null);
            setVideo(null);
            setGenre("");
            setKid(false);
        } catch (err) {
            console.log(err.response?.data);
            alert("Upload Failed");
        }
    }
    return (
        <section className="upload-page">
            <div className="card">
                <h1>Upload Video</h1>
                <form onSubmit={uploadMedia}>
                    <div>
                        <label>Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div>
                        <label>Thumbnail</label>
                        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="file-text"/>
                    </div>
                    <div>
                        <label>Video</label>
                        <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0]) } className="file-text"/>
                    </div>
                    <div>
                        <label>Genre</label>
                        <select id="genre" value={genre} onChange={(e)=>setGenre(e.target.value)}>
                            <option value="" disabled>--Select an option--</option>
                            <option value="flower">Flower</option>
                            <option value="water">Water</option>
                            <option value="food">Food</option>
                            <option value="computer">Computer</option>
                            <option value="butterfly">Butterfly</option>
                            <option value="kids">Kids</option>
                        </select>
                    </div>
                    <div class="kid1">
                        <label>Is this made for kids</label>
                        <input type="radio" name="kid" id="kid" value='true' onChange={(e)=>setKid(e.target.value)}/><p>Yes</p>
                        <input type="radio" name="kid" id="kid" value='false' onChange={(e)=>setKid(e.target.value)}/><p>No</p>
                    </div>
                    <button type="submit" className="upload-btn">Upload</button>
                </form>

            </div>
        </section>
    )
}
export default UploadView;