import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Register from './auth/Register';
import { HMSRoomProvider } from '@100mslive/react-sdk';
import ErrorPage from './error/ErrorPage';
import Channels from './components/channel/Channels';

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,  
    errorElement:<ErrorPage/>,
    children: [
      {
        path:'/rooms/room/:id',
        element:<Channels/>
      }
    ],
  },
  {
    path:'/register',
    element:<Register/>
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HMSRoomProvider>
      <RouterProvider router={router}/>
    </HMSRoomProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
