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
    Center,
    Heading,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const SignUpTab = () => {
    return (
        <Flex>
            <Box>
                <SignupHeader />
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
                    <FormLabel>First Name</FormLabel>
                    <Input type='first name' placeholder='Enter your first name' />
                </FormControl>
                <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input type='last name' placeholder='Enter your last name' />
                </FormControl>
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
                <FormControl>
                    <FormLabel>Password-Confirm</FormLabel>
                    <Input type='password' placeholder='Re-enter your password' />
                </FormControl>
            </form>
            <Center>
                <Button size='lg' colorScheme='cyan' mt='24px'>
                    <Link to='/'>Complete Sign Up</Link> {/* to mainpage */}
                </Button>
            </Center>
        </Box>
    )
}

const SignupHeader = () => {
    return (
        <Center>
            <Box>
                <Heading>Welcome, AI Creators</Heading>
            </Box>
        </Center>
    )
}

export default SignUpTab
