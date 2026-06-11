import React, { useEffect, useState } from 'react'
import api from '../../services/api';
import ImageCard from './ImageCard';
import '../../styles/MyImages.css'
function MyImages() {
  const [images, setImages] = useState([]);
  const id = localStorage.getItem('id');
  const approvedImages = images.filter(
    (i) => i.status === "approved" && i.userId?.toString() === id
  );

  const rejectedImages = images.filter(
    (i) => i.status === "rejected" && i.userId?.toString() === id
  );

  const pendingImages = images.filter(
    (i) => i.status === "pending" && i.userId?.toString() === id
  );
  async function getImages() {
    const response = await api.get('/image');
    console.log("All images:", response.data);
    console.log("Logged in user id:", id);
    setImages(response.data);
  }
  useEffect(() => {
    getImages()
  }, [])
  return (
    <section className='my-images-page'>
      <h1>My Media</h1>
      <div className="image-section">
        <h3>Approved Images</h3>
        <div className='image-row'>
          {approvedImages.map((i) => (
            <ImageCard key={i.id} image={i} />
          ))}
        </div>
      </div>
      <div className="image-section">
        <h3>Pending Images</h3>
        <div className='image-row'>
          {pendingImages.map((i) => (
            <ImageCard key={i.id} image={i} />
          ))}
        </div>

      </div>
      <div className='rejected-images'>
        <h3>Rejected Images</h3>
        <div className="image-row">
          {rejectedImages.map((i) => (
            <ImageCard key={i.id} image={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MyImages