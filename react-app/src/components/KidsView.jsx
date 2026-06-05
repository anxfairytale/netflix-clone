import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";
import ImageCard from "./Home/ImageCard";
function KidsView({ setKids }) {
    const navigate = useNavigate();
    useEffect(() => {
        setKids(true)
    }, [])
    const [images, setImages] = useState([]);
    const [dispImage, setDispImage] = useState([]);
    useEffect(() => {
        getImages()
    }, [])
    async function getImages() {
        const response = await api.get('/image/approved');
        setImages(response.data)
        const filteredImages = response.data.filter((i) => i.forKids === true);
        setDispImage(filteredImages);
    }
    function confirmDelete(){}
    function promptLogin() {}
    return (
        <section className="kids-page">
            <h1>Kids Page</h1>
            <div className="kids-content">
                {dispImage.map((ima) =>
                    <ImageCard key={ima.id} image={ima} confirmDelete={confirmDelete} promptLogin={promptLogin} />
                )}
            </div>

        </section>
    )
}
export default KidsView;