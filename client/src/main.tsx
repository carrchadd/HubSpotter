import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Landing from "./Landing"
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LandingPage from './components/LandingPage';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import About from './components/About';
import User from './User';
import MainMap from './components/MainMap';
import { Contact } from './components/Contact';
import Feedback from './components/Feedback';
import Profile from './components/Profile';
import { AuthProvider } from './components/AuthContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/map",
        element: <MainMap />
      }
    ],
  },
  {
    path:"/",
    element: <User />,
    children: [
      {
        path: "/login",
        element: <LogIn />
      },
      {
        path: "/signup",
        element: <SignUp />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
        path: "/feedback",
        element: <Feedback />
      },
      {
        path: "/profile",
        element: <Profile />
      }
    ],
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <AuthProvider>
      <RouterProvider router={router} />
      </AuthProvider>
  </StrictMode>,
)
