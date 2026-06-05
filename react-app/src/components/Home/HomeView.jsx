import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../../services/api";
import ImageCard from "./ImageCard"
import "../../styles/MainView.css"
function HomeView() {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [allImages, setAllImages] = useState([])
    const genres = [...new Set(allImages.map(image => image.genre))]
    useEffect(() => {
        getApprovedImages();
    }, []);
    const [dial, setDial] = useState(false);
    const [id, setId] = useState('');
    const [log, setLog] = useState(false);
    async function getApprovedImages() {
        try {
            const response = await api.get("/image/approved");
            setImages(response.data);
            setAllImages(response.data);
        } catch (err) {
            console.log(err);
        }
    }
    function handleDelete() {
        setImages((prevImages) =>
            prevImages.filter((image) => image.id != id)
        )
        setAllImages((prevImages) =>
            prevImages.filter((image) => image.id != id))
    }
    function promptLogin() {
        setLog(true);
    }
    function confirmDelete(e, id) {
        e.stopPropagation();
        setId(id)
        setDial(true);
    }
    function notConfirm() {
        setDial(false);
    }
    function login() {
        navigate("/login");
    }
    async function deleteId() {
        await api.delete(`/image/${id}`);
        handleDelete();
        setDial(false)
    }
    function searchVideo(e) {
        const v = e.target.value.toLowerCase();
        const filteredImages = allImages.filter((image) =>
            image.title.toLowerCase().includes(v)
        );
        setImages(filteredImages)
    }
    function handleSearch(e) {
        const v = e.target.value;
        if (v === 'All') {
            setImages(allImages)
            return;
        }
        const filteredImages = allImages.filter((image) => image.genre === v);
        setImages(filteredImages)
    }
    return (
        <section className="home-page">
            <h1>Home Page</h1>
            {log && (<div className="modal-overlay">
                <dialog open class="d1">
                    <h1>Login</h1>
                    <p>To continue watching the video, consider logging in</p>
                    <button onClick={login} className="secondary">Login</button>
                    <button onClick={() => setLog(false)} className="secondary">Back</button>
                </dialog>
            </div>)}
            {dial && (<div className="modal-overlay">
                <dialog open className="d1">
                    <h1>Are you sure you want to delete this video?</h1>
                    <p>Changes made cannot be undone</p>
                    <button onClick={notConfirm} className="secondary">No</button>
                    <button onClick={deleteId} className="danger">Yes</button>
                </dialog>
            </div>)
            }
            <div className="search-controls">
                <div className="search">
                    <input type="search" className="search-bar" placeholder="Search Videos" onChange={searchVideo} />
                </div>
                {/* <div className="genre">
                    <select className="drop" onChange={handleSearch}>
                        <option key="all" value="All">Select a genre</option>
                        {genres.map((genre) => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select></div> */}

            </div>
            <div>
                {genres.map((genre,i)=>{
                    
                    const filteredImages=images.filter((i)=>i.genre.toLowerCase()==genre);
                    if(filteredImages.length===0) return null;
                    return(
                        <section key={i} className="genre-section">
                            <h3>{genre.toUpperCase()}</h3>
                            <div className="home-grid">
                                {filteredImages.map((image)=>(
                        <ImageCard key={image.id} image={image} confirmDelete={confirmDelete} promptLogin={promptLogin}/>
                    ))}
                            </div>
                        </section>
                    )
                })}
            </div>
        </section>

    )
}
export default HomeView;