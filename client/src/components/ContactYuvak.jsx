import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export const Contact = ({post}) => {

    const [landLord,setLandlord] = useState(null);
    const [message,setMessage] = useState("");
    const onhandleChange = (e)=>{
        setMessage(e.target.value)
    }
    useEffect(()=>{

        const fetchLandlord = async ()=>{
            try {
                const res = await fetch(`/api/post/getpost/${post._id}`);
                console.log(post._id)
                const data = await res.json();
                setLandlord(data)
            } catch (error) {
                
            }
        }
        fetchLandlord();

    },[post.yuvakId])

  return (
    <>
        {landLord && (
            <div className='flex flex-col gap-2' >
                <p>Contact <span className='font-semibold' >{landLord.username}</span> for <span className='font-semibold' >{post.name.toLowerCase()}</span></p>
                <textarea className='w-full border p-3 rounded-lg' name="message" id="message" rows="2" value={message} onChange={onhandleChange} placeholder='Enter your message Here' ></textarea>
                <Link to={`mailto:${landLord.email}?subject=Regarding ${post.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95' >Send Message</Link>
            </div>
        )}
    </>
  )
}