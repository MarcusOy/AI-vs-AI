import React from 'react'
import { Box, Flex, FormControl, FormLabel, Input, Center, Heading, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
const LoginTab = () => {
    return (
        <Flex>
            <Box>
                <LoginHeader />
                <LoginForm />
            </Box>
        </Flex>
    )
}

const LoginForm = () => {
    return (
        <Box>
            <form>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input type='email' placeholder='Enter your email address' />
                </FormControl>
                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input type='username' placeholder='Enter your username' />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input type='password' placeholder='Enter your password' />
                </FormControl>
            </form>
            <Center>
                <Button size='lg' colorScheme='cyan' mt='24px'>
                    <Link to='/'>Log In</Link> {/* to mainpage */}
                </Button>
            </Center>
        </Box>
    )
}

const LoginHeader = () => {
    return (
        <Center>
            <Box>
                <Heading color=''>Glad to see you</Heading>
            </Box>
        </Center>
    )
}

export default LoginTab
