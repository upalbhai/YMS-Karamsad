import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import { Contact } from '../components/ContactYuvak';
export default function PostPage() {
  const { currentUser } = useSelector((state) => state.user);
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
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
  }, [postId]);

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
  const formatPhoneNumber=(phoneNumber) => {
    if(phoneNumber.length===13){
      const countryCode = phoneNumber.match(/^(\+?\d{1,3})/)[1];
      const nationalNumber = phoneNumber.replace(countryCode, "");
      return `${countryCode} ${nationalNumber.slice(0,5)} ${nationalNumber.slice(5)}`;
    }
    else{
      const countryCode = phoneNumber.match(/^(\+?\d{1,2})/)[1];
      const nationalNumber = phoneNumber.replace(countryCode, "");
    return `${countryCode} ${nationalNumber.slice(0,5)} ${nationalNumber.slice(5)}`;
    }
    
    
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
            <span className="font-bold text-custom-orange">Phone Number:-</span>
            +{formatPhoneNumber(post.pNumber)} {/* Formatted phone number */}
        </div>
      <div className='p-3 max-w-2xl text-justify mx-auto w-full post-content'>
            <span className="font-bold text-custom-orange">Parent's Number:-</span>+{formatPhoneNumber(post.parentNumber)} {/* Formatted phone number */}
        </div>
      <div className='p-3 max-w-2xl text-justify mx-auto w-full post-content'>
      <span className='font-bold text-custom-orange'>Blood Group :-</span>{post && post.bloodGroup}
      </div>
      <div className='p-3 max-w-2xl text-justify mx-auto w-full post-content'>
      <span className='font-bold text-custom-orange'>Email Id :- </span>{post && post.email}
      </div>
      
      <div className='p-3 max-w-2xl text-justify mx-auto w-full post-content'>
      <span className='font-bold text-custom-orange'>Parent's Number :-</span>{post && post.parentNumber}
      </div>
      <div className='p-3 max-w-2xl text-justify mx-auto w-full post-content'>
      <span className='font-bold text-custom-orange'>Country :-</span>{post && post.country}
      </div>
      <div className='p-3 max-w-2xl text-justify mx-auto w-full post-content'>  
      <span className='font-bold text-custom-orange'>State :-</span>{post && post.state}
      </div>
      <div className='p-3 max-w-2xl text-justify mx-auto w-full post-content'>
      <span className='font-bold text-custom-orange'>Birth Date (YYYY-MM-DD) :-</span>{post && post.birthDate  }
      </div>
      <Link to={`/update-post/${post._id}`}>
      {
        currentUser && currentUser.yuvakId===postId ? (
          <div className='flex items-center justify-center my-5'>
              <Button type='submit' className='bg-custom-btn'>Edit</Button>
          </div>

        ) : ""
      }
                       
                     </Link>
                     <Contact post={post} />

    </main>
  );
}