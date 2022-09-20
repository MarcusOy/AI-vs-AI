import React, { useState } from 'react'

import {
    Input,
    Flex,
    Box,
    FormControl,
    FormLabel,
    Button,
    Center,
    Heading,
    FormErrorMessage,
    FormHelperText,
    Alert,
    AlertIcon,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const SignUpTab = () => {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const isError1 = firstname === ''
    const isError2 = lastname === ''
    const isError3 = email === ''
    const isError4 = username === ''
    const isError5 = password === ''
    const isError6 = password2 === ''

    const onClick = () => {
        fetch('https://webhook.site/f87e51c8-9a3a-4836-8603-6047d18985e6', {
            body: JSON.stringify({
                firstname,
                lastname,
                email,
                username,
                password,
            }),
            method: 'POST',
        })
    }

    return (
        <Flex>
            <Box>
                <Center>
                    <Box>
                        <Heading>Welcome, AI Creators</Heading>
                    </Box>
                </Center>
                <Box>
                    <form>
                        <FormControl isInvalid={isError1}>
                            <FormLabel>First Name</FormLabel>
                            <Input
                                type='firstname'
                                placeholder='Enter your first name'
                                value={firstname}
                                onChange={(e) => {
                                    setFirstname(e.target.value)
                                }}
                            />
                            {!isError1 ? (
                                <FormHelperText></FormHelperText>
                            ) : (
                                <FormErrorMessage>First name is required</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl isInvalid={isError2}>
                            <FormLabel>Last Name</FormLabel>
                            <Input
                                type='lastname'
                                placeholder='Enter your last name'
                                value={lastname}
                                onChange={(e) => {
                                    setLastname(e.target.value)
                                }}
                            />
                            {!isError2 ? (
                                <FormHelperText></FormHelperText>
                            ) : (
                                <FormErrorMessage>Last name is required</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl isInvalid={isError3}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type='email'
                                placeholder='Enter your email address'
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                            />
                            {!isError3 ? (
                                <FormHelperText></FormHelperText>
                            ) : (
                                <FormErrorMessage>Email is required</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl isInvalid={isError4}>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type='username'
                                placeholder='Enter your username'
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                            />
                            {!isError4 ? (
                                <FormHelperText>Username </FormHelperText>
                            ) : (
                                <FormErrorMessage>Username is required</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl isInvalid={isError5}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type='password'
                                placeholder='Enter your password'
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                            />
                            {!isError5 ? (
                                <FormHelperText></FormHelperText>
                            ) : (
                                <FormErrorMessage>
                                    Password is required. Length: 4-16
                                </FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl isInvalid={isError6}>
                            <FormLabel>Password-Confirm</FormLabel>
                            <Input
                                type='password'
                                placeholder='Re-enter your password'
                                value={password2}
                                onChange={(e) => {
                                    setPassword2(e.target.value)
                                }}
                            />
                            {!isError6 ? (
                                <FormHelperText>Please match the password</FormHelperText>
                            ) : (
                                <FormErrorMessage>Password re-entry is required</FormErrorMessage>
                            )}
                        </FormControl>
                    </form>
                    <Center>
                        <Button size='lg' colorScheme='cyan' mt='24px' onClick={onClick}>
                            Complete Sign Up
                        </Button>
                    </Center>
                </Box>
            </Box>
        </Flex>
    )
}

export default SignUpTab
