import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import api, {BASE_URL} from '../../services/api';
function ImageCard({image, confirmDelete}){
    const navigate=useNavigate();
    function openVideo(){
        navigate(`/video/${image.id}`);
    }
    const role=localStorage.getItem("role");
    return(
        <div className="video-card" onClick={openVideo}>
            {image.imageURL && (
                <img src={`${BASE_URL}/${image.imageURL}`} />
            )}
            <div className="hover-info">
            <h3>{image.title}</h3>
            <p>{image.description}</p>
            {role==='admin' && <button onClick={(e)=>confirmDelete(e,image.id)}>Delete</button>}
            </div>
        </div>
    )
}
export default ImageCard;