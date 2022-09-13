import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './pages/App'
import LoginSignupPage from './pages/LoginSignupPage'
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
                    <Link to='/'>Home</Link> | <Link to='/loginSignup'>Login</Link>
                </nav>
                <Routes>
                    <Route path='/' element={<App />} />
                    <Route path='/loginSignup' element={<LoginSignupPage />} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </React.StrictMode>,
)
