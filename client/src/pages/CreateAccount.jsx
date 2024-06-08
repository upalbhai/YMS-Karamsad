import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
// import logo from '../assets/logo.png'
// import logo_white from '../assets/logo-white.png'
import toast from 'react-hot-toast';
import Oath from '../components/Oath';
export default function CreateAccount() {
  const [formData,setFormData] = useState({});
  const [errorMessage,setErrorMessage] = useState(null);
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();
  const handleChange =(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()})
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!formData.email || !formData.username || !formData.password){
      // return toast.error("Fill the details")
      return setErrorMessage("Fill the details")
    }
    try {
      // setLoading(true);
      setErrorMessage(null)
      const res = await fetch('/api/auth/signup',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success===false){
        // return setErrorMessage(data.message)
        return toast.error(data.message)
      }
      // setLoading(false);
      if(res.ok) {
        navigate('/sign-in');
        toast.success("Sign Up Successfully")
      }
    } catch (error) {
      setErrorMessage(error.message)
      // setLoading(false)
    }
  }

  return (
    <div className='min-h-screen mt-20' >
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
        <Link to='/'className='self-center font-bold dark:text-white text-4xl' >
        YMS        </Link>
        <p className='text-sm mt-5' >This is simple demo project which showcase my skill, you can able to creater a account</p>
        </div>
        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
            <div className="">
              <Label value='Your Username' />
              <TextInput type='text' placeholder='Username' id='username' onChange={handleChange} />
            </div>
            <div className="">
              <Label value='Your Email' />
              <TextInput onChange={handleChange} type='email' placeholder='Email' id='email' />
            </div>
            <div className="">
              <Label value='Your Password'/>
              <TextInput onChange={handleChange} type='password' placeholder='Password' id='password' />
            </div>
            <Button className='bg-custom-orange' type='submit'>
              {/* {
                loading ? (
                  <>
                  <Spinner size='sm'  />
                  <span className='pl-3' >Loading...</span>
                  </>
                  
                ) : 'Sign Up'
              } */}
              Sign Up
            </Button>
            <Oath />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an Account?</span>
            <Link to='/sign-in' className='font-bold text-custom-orange dark:text-teal-500'>Sign In</Link>
          </div>
          {
            errorMessage && 
            <Alert className='mt-5' color='failure' >
              {errorMessage}
            </Alert>
          }
        </div>
      </div>
    </div>
  )
}
