import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
        } else {
          setPost(data.posts[0]);
          setError(false);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-red-500'>An error occurred while fetching the post.</p>
      </div>
    );
  }

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.name}
      </h1>
       <img
        src={post && post.image}
        alt={post && post.name}
        className='mt-10 p-3 max-h-[600px] w-full object-cover'
      />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span  ><span className='font-bold text-custom-orange' >Created At:-</span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className='p-3 max-w-2xl text-justify mx-auto w-full post-content'>
        <span className='font-bold text-custom-orange' >Address :-</span> {post && post.address}
      </div>
      <div className='p-3 max-w-2xl text-justify mx-auto w-full post-content'>
      <span className='font-bold text-custom-orange'>Age :-</span>{post && post.age}
      </div>
      <div className='p-3 max-w-2xl text-justify mx-auto w-full post-content'>
      <span className='font-bold text-custom-orange'>Education :-</span>{post && post.education}
      </div>
      <div className='p-3 max-w-2xl text-justify mx-auto w-full post-content'>
      <span className='font-bold text-custom-orange'>Mobile Number :-</span>{post && post.pNumber}
      </div>
      


    </main>
  );
}
