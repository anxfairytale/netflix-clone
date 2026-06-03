import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import api, {BASE_URL} from '../../services/api';
function ImageCard({image, confirmDelete,promptLogin}){
    const navigate=useNavigate();
    const token=localStorage.getItem('token');
    function openVideo(){
        if(!token){
            promptLogin();
            return
        }
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
            <p className="description">
                {image.description.length>50 ? 
                image.description.slice(0,50) + "..." : image.description
                }
                </p>
            {role==='admin' && <button onClick={(e)=>confirmDelete(e,image.id) } className="danger">Delete</button>}
            </div>
        </div>
    )
}
export default ImageCard;