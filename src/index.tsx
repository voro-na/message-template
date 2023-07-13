import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./error-page";
import MessageEditor from "./pages/messageEditor";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
let arrVarNames = ['firstname', 'lastname', 'company', 'position']
let template = null
let callbackSave: () => {}

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage />,
    },
    {
        path: "messageEditor",
        element: <MessageEditor arrVarNames={arrVarNames} template={template}/>,
    },
]);


root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);

