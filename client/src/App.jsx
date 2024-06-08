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


function App() {

  return (
    <BrowserRouter>
    {/* <ScrollToTop /> */}
    {/* <Header /> */}
    <Header />
      <Routes>
        <Route path='/sign-in' element={<Login/>} />
        <Route path='/sign-up' element={<CreateAccount/>} />


        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreateUser />} />
          <Route path='/update-post/:postId' element={<UpdateUser />} />
        </Route>
      </Routes>
      
      <Toaster />
    </BrowserRouter>
  )
}

export default App
