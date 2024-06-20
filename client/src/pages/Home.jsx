import { Link } from 'react-router-dom';
// import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className=' flex flex-col gap-6 p-28 px-6 max-w-6xl mx-auto'>
      <h1 className='text-custom-orange dark:text-slate-200 text-3xl font-bold lg:text-6xl sm:justify-center' >Welcome to Karamsad Yuva Management System</h1>

        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline dark:text-custom-orange'
        >
          View all yuvaks
        </Link>
      </div>
      <div className='p-3'>
        {/* <CallToAction /> */}
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Registered Yuvaks</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 dark:text-custom-orange hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}