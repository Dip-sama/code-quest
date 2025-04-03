import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Askquestion from './pages/Askquestion/Askquestion'
import Auth from './pages/Auth/Auth'
import Question from './pages/Question/Question'
import Displayquestion from './pages/Question/Displayquestion'
import Tags from './pages/Tags/Tags'
import Users from './pages/Users/Users'
import Userprofile from './pages/Userprofile/Userprofile'
import Navbar from './Comnponent/Navbar/navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Questions from './pages/Questions'
import PublicSpace from './Comnponent/Social/PublicSpace'
import Chatbot from './Comnponent/Chat/Chatbot'
import VideoUpload from './Comnponent/Questions/VideoUpload'
import SubscriptionPlans from './Comnponent/Subscription/SubscriptionPlans'
import LocationTracker from './Comnponent/Profile/LocationTracker'
import NotificationCenter from './Comnponent/Notifications/NotificationCenter'
import PrivateRoute from './Comnponent/Auth/PrivateRoute'

function Allroutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/Askquestion' element={<Askquestion />}/>
        <Route path='/Auth' element={<Auth />}/>
        <Route path='/Question' element={<Question />}/>
        <Route path='/Question/:id' element={<Displayquestion />}/>
        <Route path='/Tags' element={<Tags />}/>
        <Route path='/Users' element={<Users />}/>
        <Route path='/Users/:id' element={<Userprofile />}/>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route
          path='/profile'
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path='/questions'
          element={
            <PrivateRoute>
              <Questions />
            </PrivateRoute>
          }
        />
        <Route
          path='/public-space'
          element={
            <PrivateRoute>
              <PublicSpace />
            </PrivateRoute>
          }
        />
        <Route
          path='/chatbot'
          element={
            <PrivateRoute>
              <Chatbot />
            </PrivateRoute>
          }
        />
        <Route
          path='/video-upload'
          element={
            <PrivateRoute>
              <VideoUpload />
            </PrivateRoute>
          }
        />
        <Route
          path='/subscription'
          element={
            <PrivateRoute>
              <SubscriptionPlans />
            </PrivateRoute>
          }
        />
        <Route
          path='/location'
          element={
            <PrivateRoute>
              <LocationTracker />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  )
}

export default Allroutes