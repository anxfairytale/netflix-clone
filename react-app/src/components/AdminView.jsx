import React, { useEffect, useState } from 'react';
import '../styles/AdminView.css'
import api, { BASE_URL } from '../services/api';
function AdminView() {
    const [images, setImages] = useState([]);
    const [selectedImage,setSelectedImage] = useState(null);
    useEffect(() => {
        getPendingImages();
    }, []);
    function openPreview(image){
        setSelectedImage(image);
    }
    function closePreview(){
        setSelectedImage(null);
    }
    async function getPendingImages() {
        try {
            const response = await api.get("/image/pending");
            console.log(response.data);
            setImages(response.data);
        } catch (err) {
            console.log(err);
        }
    }
    async function approveImage(e,id) {
        e.stopPropagation();
        try {
            await api.patch(`/image/${id}/approve`);
            setImages((prevImages) => prevImages.filter((image) => String(image.id) !== String(id)))
        } catch (err) {
            console.log(err);
        }
    }
    async function rejectImage(e,id) {
        e.stopPropagation();
        try {
            await api.patch(`/image/${id}/reject`);
            setImages((prevImages) => prevImages.filter((image) => String(image.id) !== String(id)))
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <section className="admin-page">
            <h1>Pending Approval</h1>
            <table className="approval-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>User</th>
                        <th>Genre</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {images.map((image) => (
                        <tr key={image.id} onClick={() => openPreview(image)}>
                            <td>{image.title}</td>
                            <td>{image.description}</td>
                            <td>{image.userId}</td>
                            <td>{image.genre}</td>
                            <td>
                                <button className="appr" onClick={(e) => approveImage(e, image.id)}>Approve</button>
                                <button className="rej" onClick={(e) => rejectImage(e, image.id)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedImage && (
                <div className="modal-backdrop" onClick={closePreview}>
                    <div className='preview-card' onClick={(e) => e.stopPropagation()}>
                        <button onClick={closePreview}>X</button>
                        <h2>{selectedImage.title}</h2>
                        <p>{selectedImage.description}</p>
                        {selectedImage.imageURL && (
                            <img src={`${BASE_URL}/${selectedImage.imageURL}`}
                                alt={selectedImage.title} />
                        )}
                        {selectedImage.videoURL && (
                            <video
                                controls
                                src={`${BASE_URL}/${selectedImage.videoURL}`}
                            ></video>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}
export default AdminView;