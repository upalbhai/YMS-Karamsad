import { Button } from 'flowbite-react'
import React from 'react'
import {GoogleAuthProvider, signInWithPopup,getAuth} from 'firebase/auth'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
export default function Oath() {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () =>{
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
                })
            const data = await res.json()
            if (res.ok){
                dispatch(signInSuccess(data));
                toast.success('Sign in with google successfully')
                navigate('/')
            }
            else{
                toast.error('Hey please enter correct email id which you have entered in previous form')
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }     
  return (
    <>
    <Button className='dark:bg-custom-orange bg-custom-btn' onClick={handleGoogleClick} >
      <AiFillGoogleCircle className="w-6 h-6 mr-2 " /> Sign in with Google
    </Button>
    </>
  )
}
