import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice';
import Oath from '../components/Oath';

export default function Login() {
  const { error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(signInFailure('Please fill all the fields'));
      return;
    }

    setLoading(true);
    dispatch(signInStart());

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message || 'Sign-in failed'));
        setLoading(false);
        return;
      }

      dispatch(signInSuccess(data));
      setLoading(false);
      navigate('/');
      toast.success('Sign In Successfully');
    } catch (error) {
      dispatch(signInFailure(error.message));
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to='/' className='self-center font-bold dark:text-white text-4xl'>YMS</Link>
        </div>
        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your Email' />
              <TextInput 
                onChange={handleChange} 
                type='email' 
                placeholder='Email' 
                id='email' 
                required 
              />
            </div>
            <div>
              <Label value='Your Password' />
              <TextInput 
                onChange={handleChange} 
                type='password' 
                placeholder='Password' 
                id='password' 
                required 
              />
            </div>
            <Button className='bg-custom-orange dark:bg-teal-500' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : 'Sign In'}
            </Button>
            <Oath />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't Have an Account?</span>
            <Link className='font-bold text-custom-orange dark:text-teal-500' to='/sign-up'>Sign Up</Link>
          </div>
          {errorMessage && 
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          }
        </div>
      </div>
    </div>
  );
}
