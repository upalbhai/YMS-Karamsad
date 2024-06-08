import { Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';
import toast from 'react-hot-toast';
import { updateStart,updateFailure,updateSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,signoutSuccess } from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function DashProfile() {
    const {currentUser,error}= useSelector((state)=>state.user);
    const [imageFile,setImageFile] = useState(null);

    const [imageUrl,setImageUrl] = useState(null);
    const [loading,setLoading] = useState(false);
    const [showModal,setShowModal] = useState(false)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [formData,setFormData] = useState({})
    const [imageFileUploadError,setImageFileUploadError] = useState(null)
    const filePickerRef = useRef();
    const dispatch = useDispatch();
    console.log(imageFileUploadProgress,imageUrl)
    useEffect(()=>{
        if(imageFile){
            uploadImage();
        }
    },[imageFile]);

const uploadImage = async () => {
  try {
    if (!imageFile) {
      setImageFileUploadError('No file selected.');
      return toast.error('no file selected');
    }

    const fileType = imageFile.type.split('/')[0];
    const maxSizeMB = 2;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (fileType !== 'image') {
      setImageFileUploadError('Only image files are allowed.');
      return toast.error("Only images are allowed");
    }

    if (imageFile.size > maxSizeBytes) {
      setImageFileUploadError(`File size should be less than ${maxSizeMB} MB.`);
      return;
    }

    console.log('Uploading...');
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}_${imageFile.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
        setLoading(true)
      },
      (error) => {
        let errorMessage = 'An error occurred during the upload.';
        if (error.code === 'storage/unauthorized') {
          errorMessage = 'You are not authorized to upload this file.';
        } else if (error.code === 'storage/canceled') {
          errorMessage = 'File upload was canceled.';
        } else if (error.code === 'storage/unknown') {
          errorMessage = 'Unknown error occurred, please try again later.';
        }
        setImageFileUploadError(errorMessage);
        setImageFile(null)
        setImageUrl(null)
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);
          setLoading(false)
          setFormData({...formData,profilePicture:downloadURL})
        //   console.log('File available at', downloadURL);
        } catch (urlError) {
          setImageFileUploadError('Failed to get the download URL.');
        }
      }
    );
  } catch (error) {
    console.error('Upload failed:', error);
    setImageFileUploadError('An unexpected error occurred during the upload.');
  }
};

    const handleChangeImage = (e)=>{
        const file = e.target.files[0]
        if(file){
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file))
        }
    }
// form data mate chu state
    const handleChange = (e)=>{
        setFormData({...formData,[e.target.id]:e.target.value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(Object.keys(formData).length===0){
            return toast.error('No changes were made !!!');
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            })
            const data = await res.json();
            if(!res.ok){
                dispatch(updateFailure(data.message));
                return toast.error(data.message)
            }
            else{
                dispatch(updateSuccess(data));
                toast.success('Profile update successfully');
            }
        } catch (error) {
            
        }
    }
    const handleDelete = async () => {
        setShowModal(false);
        try {
          dispatch(deleteUserStart());
          const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (!res.ok) {
            dispatch(deleteUserFailure(data.message));
            return toast(data.message)
          } else {
            dispatch(deleteUserSuccess(data));
            toast.success('User deleted successfully');
          }
        } catch (error) {
          dispatch(deleteUserFailure(error.message));
          toast.error(error.message)
        }
      };
    const handleSignout = async () => {
        try {
          const res = await fetch('/api/user/signout', {
            method: 'POST',
          });
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
            return toast.error(data.message);
          } else {
            dispatch(signoutSuccess());
            toast.success('Signout successfully');
          }
        } catch (error) {
          console.log(error.message);
          toast.error(error.message)
        }
      };
    // console.log(formData)
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl' >Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input className='hidden' type="file" accept='image/*' ref={filePickerRef} onChange={handleChangeImage}/>
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=>filePickerRef.current.click()} >


        {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}

            <img src={imageUrl || currentUser.profilePicture} className={`rounded-full w-full h-full border-8 object-cover border-[lightgray]' alt="" ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60' } `} />
        </div>
        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username}  onChange={handleChange}/>
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email}  onChange={handleChange}/>
        <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>
        <Button type='submit' className=' bg-custom-nav text-black border-black dark:bg-custom-orange' disabled={loading} >Update</Button>
        {
            currentUser.isAdmin && (
                <Link to='/create-post'>
                <Button type='button' className='w-full dark:bg-teal-600 bg-custom-btn' >
                    Create A User
                </Button>
                </Link>
            ) 
        }
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={()=>setShowModal(true)} className='cursor-pointer' >Delete</span>
        <span className='cursor-pointer' onClick={handleSignout} >SignOut</span>
      </div>
      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md' >
        <Modal.Header />
        <Modal.Body>
            <div className="text-center">
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-700 dark:text-gray-200 mb-4 mx-auto' />
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-200' >Are You Sure Want To Delete This Account?</h3>
                <div className='flex justify-center gap-4' >
                    <Button color='failure' onClick={handleDelete} >Yes I'm sure</Button>
                    <Button color='success' onClick={()=>setShowModal(false)} >No, Cancel</Button>
                </div>
            </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
 