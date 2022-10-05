import {
    Box,
    Button,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    Stack,
    ThemeProvider,
    theme,
    CSSReset,
    Wrap,
    ColorModeProvider,
    Spinner,
    Center,
} from '@chakra-ui/react'
import { AVAStore } from './data/DataStore'
import React, { useEffect, useState } from 'react'
import LoginSignupPage from './pages/LoginSignupPage'
import WelcomePage from './pages/WelcomePage'
import Profile from './pages/Profile'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import useAVAFetch from './helpers/useAVAFetch'
import IdentityService from './data/IdentityService'
import { User } from './models/user'
import NotFoundPage from './pages/NotFoundPage'
import Report from './pages/ReportPage'
function App() {
    const { data, isLoading, error, execute } = useAVAFetch('/WhoAmI')
    const { whoAmI, hasSuccessfullyLoggedIn, hasSuccessfullyLoggedOut } = AVAStore.useState()

    // trigger WhoAmI query on login and logout
    useEffect(() => {
        execute()
    }, [hasSuccessfullyLoggedIn, hasSuccessfullyLoggedOut])

    // set identity in global state
    useEffect(() => {
        if (data) IdentityService.setIdentity(data as User)
    }, [data])

    // display loading spinner when loading identity
    if (isLoading)
        return (
            <Center>
                <Spinner />
            </Center>
        )

    const isLoggedIn = whoAmI != undefined

    return (
        <BrowserRouter>
            <nav
                style={{
                    borderBottom: 'solid 1px',
                    paddingBottom: '1rem',
                }}
            >
                <Link to=''>Home Page</Link> | <Link to='/LoginSignup'>Login/Signup</Link>
            </nav>
            {isLoggedIn ? (
                <Routes>
                    <Route path='/' element={<Navigate to='/Feed' />} />
                    <Route path='/Feed' element={<LoginSignupPage />} />
                    <Route path='/Profile' element={<Profile />} />
                    <Route path='/Report' element={<Report />} />
                    {/* 👇️ only match this when no other routes match */}
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            ) : (
                <Routes>
                    <Route path='/' element={<WelcomePage />} />
                    <Route path='/LoginSignup' element={<LoginSignupPage />} />
                    <Route path='/Profile' element={<Profile />} />
                    <Route path='/Report' element={<Report />} />
                    {/* 👇️ only match this when no other routes match */}
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            )}
        </BrowserRouter>
    )
}

export default App
