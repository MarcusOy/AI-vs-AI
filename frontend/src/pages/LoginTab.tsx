import React from 'react'
import { Box, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react'

const LoginTab = () => {
    return (
        <Flex>
            <Box>
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

export default LoginTab
