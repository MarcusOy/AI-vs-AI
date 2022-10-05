import { Stack, Link as ChakraLink, Text, Spinner, Center } from '@chakra-ui/react'
import { AVAStore } from './data/DataStore'
import React, { useEffect } from 'react'
import LoginSignupPage from './pages/LoginSignupPage'
import WelcomePage from './pages/WelcomePage'
import ProfilePage from './pages/ProfilePage'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAVAFetch from './helpers/useAVAFetch'
import IdentityService from './data/IdentityService'
import { User } from './models/user'
import NotFoundPage from './pages/NotFoundPage'
import Header from './components/Header'
import { WarningIcon } from '@chakra-ui/icons'
import FeedPage from './pages/FeedPage'
import Programming from './pages/Programming'

function App() {
    const { data, isLoading, error, execute } = useAVAFetch('/Account/WhoAmI')
    const { whoAmI, whoAmIUpdateNumber } = AVAStore.useState()

    // trigger WhoAmI query on login and logout
    useEffect(() => {
        execute()
    }, [whoAmIUpdateNumber])

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
    console.log({ whoAmI, isLoggedIn })

    return (
        <BrowserRouter>
            <Header isLoggedIn={isLoggedIn} />
            <Stack display={['none', 'none', 'block']}>
                <Stack pt='2rem' as='main' maxWidth='8xl' marginInline='auto'>
                    {isLoggedIn ? (
                        <Routes>
                            <Route path='/' element={<Navigate to='/Feed' />} />
                            <Route path='/Feed' element={<FeedPage />} />
                            <Route path='/Profile' element={<ProfilePage />} />
                            <Route path='/Programming' element={<Programming/>}/>
                            {/* 👇️ only match this when no other routes match */}
                            <Route path='*' element={<NotFoundPage />} />
                        </Routes>
                    ) : (
                        <Routes>
                            <Route path='/' element={<WelcomePage />} />
                            <Route path='/Auth/:mode' element={<LoginSignupPage />} />

                            {/* 👇️ only match this when no other routes match */}
                            <Route path='*' element={<NotFoundPage />} />
                        </Routes>
                    )}
                </Stack>
            </Stack>
            <Stack display={['block', 'block', 'none']}>
                <Center>
                    <Stack mt='48' alignItems='center'>
                        <WarningIcon w={50} h={50} />
                        <Text fontSize='5xl'>Mobile not supported</Text>
                        <Text fontSize='lg'>This app is for desktop/laptop only</Text>
                        <ChakraLink onClick={() => history.back()} color='teal.500'>
                            Go back to where you came from.
                        </ChakraLink>
                    </Stack>
                </Center>
            </Stack>
        </BrowserRouter>
    )
}

export default App