import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './pages/App'
import LoginSignupPage from './pages/LoginSignupPage'
import Programming from './pages/Programming'
import WelcomePage from './pages/WelcomePage'
import Profile from './pages/Profile'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </React.StrictMode>,
)
