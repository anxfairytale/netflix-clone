import React, { useEffect, useState } from 'react';
import '../styles/AdminView.css'
import api, { BASE_URL } from '../services/api';
function AdminView() {
    const [images, setImages] = useState([]);
    useEffect(() => {
        getPendingImages();
    }, []);
    async function getPendingImages() {
        try {
            const response = await api.get("/image/pending");
            console.log(response.data);
            setImages(response.data);
        } catch (err) {
            console.log(err);
        }
    }
    async function approveImage(id) {
        try {
            await api.patch(`/image/${id}/approve`);
            console.log("clicked id:", id);
            console.log("before:", images);
            setImages((prevImages) => prevImages.filter((image) => String(image.id) !== String(id)))
        } catch (err) {
            console.log(err);
        }
    }
    async function rejectImage(id) {
        try {
            await api.patch(`/image/${id}/reject`);
            console.log("clicked id:", id);
            console.log("before:", images);
            setImages((prevImages) => prevImages.filter((image) => String(image.id) !== String(id)))
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <section className="admin-page">
            <h1>Pending Approval</h1>
            <div className="admin-grid">
                {images.map((image) => (
                    <div className="admin-card" key={image.id}>
                        {image.imageURL && (
                            <img className="admin-media" src={`${BASE_URL}/${image.imageURL}`}
                                width="300" />
                        )}
                        {image.videoURL && (
                            <video className="admin-media" controls width="300" src={`${BASE_URL}/${image.videoURL}`}></video>
                        )}
                        <h3>{image.title}</h3>
                        <p>{image.description}</p>
                        <div className="admin-actions">
                            <button className="approve" onClick={() => approveImage(image.id)}>Approve</button>
                            <button className='reject' onClick={() => rejectImage(image.id)}>Reject</button>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    )
}
export default AdminView;