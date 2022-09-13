import React from 'react'
import {
    Input,
    Flex,
    Box,
    FormControl,
    FormLabel,
    Button,
    ButtonGroup,
    Container,
} from '@chakra-ui/react'

const SignUpTab = () => {
    return (
        <Flex>
            <Box>
                <SignUpForm />
            </Box>
        </Flex>
    )
}

const SignUpForm = () => {
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

export default SignUpTab
