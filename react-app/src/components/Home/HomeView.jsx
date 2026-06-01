import React, {useEffect,useState} from "react";
import api from "../../services/api";
import ImageCard from "./ImageCard"
import "../../styles/MainView.css"
function HomeView(){
    const[images,setImages]=useState([]);
    useEffect(()=>{
        getApprovedImages();
    },[]);
    const [dial,setDial]=useState(false);
    const [id,setId]=useState('');
    async function getApprovedImages(){
        try{
            const response=await api.get("/image/approved");
            setImages(response.data);
        }catch(err){
            console.log(err);
        }
    }
    function handleDelete(){
        setImages((prevImages)=>
            prevImages.filter((image)=>image.id!=id)
        )    
    }
    function confirmDelete(e,id){
        e.stopPropagation();
        setId(id)
        setDial(true);
    }
    function notConfirm(){
        setDial(false);
    }
    async function deleteId(){
        await api.delete(`/image/${id}`);
        handleDelete();
        setDial(false)
    }
    return(
        <section className="home-page">
             <h1>Home Page</h1>
             
                {dial && (<div className="modal-overlay">
                    <dialog open class="d1">
                <h1>Are you sure you want to delete this video?</h1>
                <p>Changes made cannot be undone</p>
                <button onClick={notConfirm}>No</button>
                <button onClick={deleteId}>Yes</button>
                </dialog>
                </div>)
            }
             
             
            <div className="home-grid">
                {images.map((image)=>(
                    <ImageCard key={image.id} image={image} confirmDelete={confirmDelete}/>
                ))}
             </div>

        </section>
       
    )
}
export default HomeView;