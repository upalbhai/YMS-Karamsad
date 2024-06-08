import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Table,Modal,Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

import { HiOutlineExclamationCircle } from 'react-icons/hi';
export default function DashPost() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore,setShowMore] = useState(false)
    const [showModal,setShowModal] = useState(false)
    const [postIdToDelete,setPostIdToDelete] = useState('');
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
          const data = await res.json();
          setShowMore(true)
            console.log(userPosts)
          if (!res.ok) {
            return toast.error(data.message || 'Failed to fetch posts');
          }
          if(data.length<9){
            setShowMore(false)
          }
  
          setUserPosts(data.posts);
        } catch (error) {
          toast.error(error.message || 'An error occurred');
        }
      };
  
      if (currentUser && currentUser.isAdmin) {
        fetchPosts();
      }
    }, [currentUser._id]);
    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
          const res = await fetch(
            `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
          );
          const data = await res.json();
          if (res.ok) {
            setUserPosts((prev) => [...prev, ...data.posts]);
            if (data.posts.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
          toast.error(error.message);
        }
      };
      const handleDelete = async () => {
        try {
            setShowModal(false);
            const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
                method: 'DELETE',
            });
    
            const data = await res.json(); // Ensure this is called immediately after the fetch
    
            if (!res.ok) {
                return toast(data.message);
            }
    
            setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete)); // Fixed comparison operator
            toast.success("Post has been deleted successfully");
        } catch (error) {
            toast.error(error.message);
        }
    };
    
    
  return (
    <div className='table-auto  overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scroll-bar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scroll-bar-thumb-slate-500' >
        {currentUser.isAdmin && userPosts.length>0 ? (
           <>
           <Table hoverable className='shadow-md  bg-slate-200'>
             <Table.Head>
               <Table.HeadCell className='bg-gray-400'>Date Updated</Table.HeadCell>
               <Table.HeadCell className='bg-gray-400'>Yuvak Image</Table.HeadCell>
               <Table.HeadCell className='bg-gray-400'>Yuvak Name</Table.HeadCell>
               <Table.HeadCell className='bg-gray-400'>Yuvak Phone number</Table.HeadCell>
               <Table.HeadCell className='bg-gray-400'>Delete</Table.HeadCell>
               <Table.HeadCell className='bg-gray-400'><span>Edit</span></Table.HeadCell>
             </Table.Head>
             <Table.Body className='divide-y'>
               {userPosts.map((post) => (
                 <Table.Row key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800' >
                   <Table.Cell>
                     {new Date(post.updatedAt).toLocaleDateString()}
                   </Table.Cell>
                   <Table.Cell>
                     <Link to={`/post/${post.slug}`}>
                       <img className='h-10 w-20 object-cover bg-gray-500' src={post.image} alt={post.name} />
                     </Link>
                   </Table.Cell>
                   <Table.Cell className='font-medium text-gray-900 dark:text-white' >{post.name}</Table.Cell>
                   <Table.Cell>{post.pNumber}</Table.Cell>
                   <Table.Cell>
                     {/* Implement the delete functionality */}
                     <button><span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={()=>{
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                     }} >Delete</span></button>
                   </Table.Cell>
                   <Table.Cell>
                     <Link to={`/update-post/${post._id}`}>
                       <button><span className='text-teal-500 hover:underline' >Edit</span></button>
                     </Link>
                   </Table.Cell>
                 </Table.Row>
               ))}
             </Table.Body>
           </Table>
           {
            showMore &&  (
                <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
                    Show More
                </button>
            )
           }
         </>
        ):(
          <div className='flex flex-col text-center gap-4' >
            <p>You have not created any post yet</p>
            <Link to='/create-post' className='bg-blue-900 text-gray-200 p-3 rounded-xl' >Click here to create a post</Link>
          </div>
        )}
        <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md' >
        <Modal.Header />
        <Modal.Body>
            <div className="text-center">
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-700 dark:text-gray-200 mb-4 mx-auto' />
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-200' >Are You Sure Want To Delete This Post?</h3>
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
