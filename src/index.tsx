import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './styles/index.css';

import App from './App';
import ErrorPage from './pages/error/error-page';
import MessageEditor from './pages/messageEditor/messageEditor';
import { state } from './types';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const arrVarNames = ['firstname', 'lastname', 'company', 'position']
const template = null

const saveToLocalStorage = (messages: Record<string, state>) => {
    localStorage.setItem('messages', JSON.stringify(messages))
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage />,
    },
    {
        path: "messageEditor",
        element: <MessageEditor arrVarNames={arrVarNames} template={template} callbackSave={saveToLocalStorage}/>,
    },
]);


root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);

