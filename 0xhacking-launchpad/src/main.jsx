import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {store } from "./app/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "@/contexts/ThemeProvider.tsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
      </Provider>
  </StrictMode>,
)
