import React from 'react'
import { Box, Flex, FormControl, FormLabel, Input, Center, Heading } from '@chakra-ui/react'

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
