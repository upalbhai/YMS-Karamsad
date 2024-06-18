import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='group relative w-full border dark:border-custom-orange border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all'>
      <Link to={`/yuvak/${post._id}`}>
        <img
          src={post.image}
          alt='post cover'
          className='h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-3 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2'>Name:-{post.name}</p>
        <span className='italic text-sm'>Phone Number:-{post.pNumber}</span>
        <Link
          to={`/yuvak/${post._id}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 dark:border-custom-orange dark:text-custom-orange dark:hover:bg-custom-orange hover:text-white dark:hover:text-black transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read More
        </Link>
      </div>
    </div>
  );
}