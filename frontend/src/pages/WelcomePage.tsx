import React from 'react'
import { Center, Box, Heading, Text, Button, Link as ReachLink } from '@chakra-ui/react'
import LoginSignUpPage from './LoginSignupPage'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
const WelcomePage = () => {
    return (
        <Center>
            <Box maxW='32rem'>
                <Heading mb={4}>AI vs AI: A Platform Full Of Strategies and Battles</Heading>
                <Text fontSize='xl'>
                    A Real Good Platform yessir, hope everyone enjoy AI vs AI --SWE from cs407
                </Text>
                <Center>
                    <Button size='lg' colorScheme='cyan' mt='24px'>
                        <Link to='/loginSignup'>Create a free account/Login</Link>
                    </Button>
                </Center>
            </Box>
        </Center>
    )
}

export default WelcomePage
