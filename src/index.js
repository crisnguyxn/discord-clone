import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Register from './auth/Register';
import { HMSRoomProvider } from '@100mslive/react-sdk';

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,    
  },
  {
    path:'/register',
    element:<Register/>
  }
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
