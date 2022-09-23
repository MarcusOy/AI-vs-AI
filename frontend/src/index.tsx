import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './pages/App'
import LoginSignupPage from './pages/LoginSignupPage'
import WelcomePage from './pages/WelcomePage'
import Profile from './pages/Profile'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import { ChakraProvider } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <ChakraProvider>
            <BrowserRouter>
                <nav
                    style={{
                        borderBottom: 'solid 1px',
                        paddingBottom: '1rem',
                    }}
                >
                    <Link to=''>Home Page</Link> | <Link to='/loginSignup'>Login/Signup</Link>
                </nav>
                <Routes>
                    <Route path='' element={<WelcomePage />} />
                    <Route path='/loginSignup' element={<LoginSignupPage />} />
                    <Route path='/Profile' element={<Profile />} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </React.StrictMode>,
)
