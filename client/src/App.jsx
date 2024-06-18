import './index.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'
import CreateAccount from './pages/CreateAccount';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreateUser from './pages/CreateUser';
import UpdateUser from './pages/UpdateUser';
import Home from './pages/Home';
import Search from './pages/Search';
import PostPage from './pages/Post';
import ScrollToTop from './components/ScrollToTop';



function App() {

  return (
    <BrowserRouter>
    <ScrollToTop />
    {/* <Header /> */}
    <Header />
      <Routes>
        <Route path='/sign-in' element={<Login/>} />
        
        <Route path='/sign-up' element={<CreateAccount/>} />
        <Route path='/create-user' element={<CreateUser />} />

        <Route element={<PrivateRoute />}>
        <Route path='/' element={<Home/>}  />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/update-post/:postId' element={<UpdateUser />} />
          <Route path='/search' element={<Search />} />
        <Route path='/yuvak/:postId' element={<PostPage />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreateUser />} />
        </Route>
        
      </Routes> 
      
      <Toaster />
    </BrowserRouter>
  )
}

export default App
