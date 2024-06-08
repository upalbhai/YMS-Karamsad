import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import React from 'react'

import { Link,useLocation, useNavigate } from 'react-router-dom'
import {AiOutlineSearch} from 'react-icons/ai'
import { signoutSuccess } from '../redux/user/userSlice'
import {FaMoon,FaSun} from 'react-icons/fa'
import { useSelector,useDispatch } from 'react-redux'
import { toogleTheme } from '../redux/theme/themeSlice'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react';
export default function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const {theme} = useSelector((state)=>state.theme)
    const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
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
      const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
      };
  return (
    <Navbar className='border-b-2 bg-custom-nav dark:bg-custom-black' >
        <Link to='/'className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white' >
{/* <img src={logo} className='w-auto h-3 sm:h-5 dark:hidden' /> 
<img src={logo_white} className='w-auto h-3 sm:h-5 hidden dark:inline' />  */}
      YMS
       </Link>
        <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          
        />
        <Button type='submit' className='w-12 h-10 lg:hidden' pill color='gray' >
            <AiOutlineSearch />
        </Button>
        </form>
        
        <div className="flex gap-2 md:order-2">
            <Button className='w-12 h-10 hidden sm:inline ' color='gray' pill onClick={()=>dispatch(toogleTheme())} >
                { theme==='light' ? <FaSun /> : <FaMoon />}
            </Button>
        {currentUser  ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button className='bg-custom-btn' >
              Sign In
            </Button>
          </Link>
        )}
            
            <Navbar.Toggle/>
        </div>
        <Navbar.Collapse className='text-lg '>
            <Navbar.Link active={path==='/'} as={'div'} ><Link to='/' className='lg:text-lg '>Home</Link></Navbar.Link>
            <Navbar.Link active={path==='/about'} as={'div'} ><Link to='/about' className='lg:text-lg'>About</Link></Navbar.Link>
            {/* <Navbar.Link active={path==='/projects'} as={'div'} ><Link to='/projects' className='lg:text-lg'>Projects</Link></Navbar.Link> */}
        </Navbar.Collapse>
    </Navbar>
  )
}
