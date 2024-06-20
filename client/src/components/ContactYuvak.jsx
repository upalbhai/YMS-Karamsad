import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export const Contact = ({listing}) => {

    const [landLord,setLandlord] = useState(null);
    const [message,setMessage] = useState("");
    const onhandleChange = (e)=>{
        setMessage(e.target.value)
    }
    useEffect(()=>{

        const fetchLandlord = async ()=>{
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data)
            } catch (error) {
                
            }
        }
        fetchLandlord();

    },[listing.userRef])

  return (
    <>
        {landLord && (
            <div className='flex flex-col gap-2' >
                <p>Contact <span className='font-semibold' >{landLord.username}</span> for <span className='font-semibold' >{listing.name.toLowerCase()}</span></p>
                <textarea className='w-full border p-3 rounded-lg' name="message" id="message" rows="2" value={message} onChange={onhandleChange} placeholder='Enter your message Here' ></textarea>
                <Link to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95' >Send Message</Link>
            </div>
        )}
    </>
  )
}