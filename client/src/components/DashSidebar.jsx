
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sidebar } from 'flowbite-react'
import { signoutSuccess } from '../redux/user/userSlice'
import React from 'react'
import {HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser} from 'react-icons/hi'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
export default function DashSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const {currentUser} = useSelector((state)=>state.user)
    const [tab, setTab] = useState('');
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      console.log(tabFromUrl)
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
    }, [location.search]);
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
  return (
    <Sidebar className='w-full md:w-56 h-full text-white'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              as='div'
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'User'}
              labelColor='dark'
              className={`p-2 rounded ${tab === 'profile' ? 'bg-gray-400 hover:bg-gray-400' : 'hover:bg-gray-400'}`}
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <>
            <Link to='/dashboard?tab=dash'>
                <Sidebar.Item
                  as='div'
                  active={tab === 'dash'}
                  icon={HiChartPie}
                  className={`p-2 rounded ${tab === 'dash'? 'bg-gray-400 hover:bg-gray-400' : 'hover:bg-gray-400'}`}
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=posts'>
                <Sidebar.Item
                  as='div'
                  active={tab === 'posts'}
                  icon={HiDocumentText}
                  className={`p-2 rounded ${tab === 'posts'? 'bg-gray-400 hover:bg-gray-400' : 'hover:bg-gray-400'}`}
                >
                  Posts
                </Sidebar.Item>
              </Link>
              
              <Link to='/dashboard?tab=users'>
                <Sidebar.Item
                  as='div'
                  active={tab === 'users'}
                  icon={HiOutlineUserGroup}
                  className={`p-2 rounded ${tab === 'users'? 'bg-gray-400 hover:bg-gray-400' : 'hover:bg-gray-400'}`}
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=comments'>
                <Sidebar.Item
                  as='div'
                  active={tab === 'comments'}
                  icon={HiAnnotation}
                  className={`p-2 rounded ${tab === 'comments'? 'bg-gray-400 hover:bg-gray-400' : 'hover:bg-gray-400'}`}
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className='p-2 rounded cursor-pointer hover:bg-red-600'
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
