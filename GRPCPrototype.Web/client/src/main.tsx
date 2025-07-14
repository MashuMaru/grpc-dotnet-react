import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'
import {ToastContainer} from "react-fox-toast";
import App from "./App";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ToastContainer />
      <App />
  </StrictMode>,
)
