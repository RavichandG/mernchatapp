import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import { ChatProvider } from './context/ContextProvider.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import { OtpContextProvider } from './context/OtpContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <BrowserRouter>
    <OtpContextProvider>
    <ChatProvider>
     
    <ChakraProvider>
     
      <App />
      
     
      
         
    </ChakraProvider>
   
    </ChatProvider>
    </OtpContextProvider>
    </BrowserRouter>
    
  </React.StrictMode>,
)
