import { useParams } from "react-router-dom";
import React, {useEffect,useState} from "react";
import api, {BASE_URL} from '../../services/api'
import '../../styles/Video.css'
function VideoPlayer(){
    const {id}=useParams();
    const [video,setVideo]=useState(null);
    useEffect(()=>{
        getVideo();
    },[id]);
    async function getVideo(){
        try{
            const response= await api.get(`/image/${id}`);
            console.log(response.data);
            setVideo(response.data);
        }catch(err){
            console.log(err);
        }
    }
    if(!video){
        return <p>Video does not exist</p>
    }
    return(
        <section className="video-page">
            <div className="video-player">
                <video controls src={`${BASE_URL}/${video.videoURL}`}></video>
            <h1>{video.title}</h1>
            <p>{video.description}</p>
            </div>
            
        </section>
    )
}
export default VideoPlayer;