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
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { MotionValue } from 'framer-motion'

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

    const [emailErr, setEmailErr] = useState('')
    const [usernameErr, setUsernameErr] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const [password2Err, setPassword2Err] = useState('')

    const validate = () => {
        // email error check
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
        if (!regex.test(email) || !email.includes('.com')) {
            setEmailErr('Email form invalid')
            return false
        }
        // username error check
        if (username.length > 15) {
            setUsernameErr('Username is too long')
            return false
        }
        // password error check
        if (password.length < 7) {
            setPasswordErr('Password is too short')
            return false
        }
        const regex2 = /^[a-z0-9]+[!@#$%^*()-+=<>?'";{|}]$/
        if (!regex2.test(password)) {
            setPasswordErr('Password form invalid')
            return false
        }
        // password match
        if (password2 != password) {
            setPassword2Err('Password does not match')
            return false
        }

        return true
    }

    const onClick = () => {
        // fetch('https://webhook.site/f87e51c8-9a3a-4836-8603-6047d18985e6', {
        //     body: JSON.stringify({
        //         firstname,
        //         lastname,
        //         email,
        //         username,
        //         password,
        //     }),
        //     method: 'POST',
        // })
        const isValid = validate()

        if (isValid) {
            console.log(firstname, lastname, email, username, password, password2)
            handleChange
        }
    }

    const handleChange = () => {
        setEmailErr('')
        setUsernameErr('')
        setPasswordErr('')
        setPassword2Err('')
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
                    <form onChange={handleChange}>
                        <FormControl isInvalid={isError1} isRequired>
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
                        <FormControl isInvalid={isError2} isRequired>
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
                        <FormControl isInvalid={isError3} isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type='email'
                                placeholder='Enter your email address'
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                            />
                            <div style={{ fontSize: 12, color: 'red' }}>{emailErr}</div>

                            {!isError3 ? (
                                <FormHelperText></FormHelperText>
                            ) : (
                                <FormErrorMessage>Email is required</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl isInvalid={isError4} isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type='username'
                                placeholder='Enter your username'
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                            />
                            <div style={{ fontSize: 12, color: 'red' }}>{usernameErr}</div>
                            {!isError4 ? (
                                <FormHelperText></FormHelperText>
                            ) : (
                                <FormErrorMessage>Username is required</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl isInvalid={isError5} isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type='password'
                                placeholder='Enter your password'
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                            />
                            <div style={{ fontSize: 12, color: 'red' }}>{passwordErr}</div>
                            {!isError5 ? (
                                <FormHelperText></FormHelperText>
                            ) : (
                                <FormErrorMessage>
                                    Password is required. Length: 4-16
                                </FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl isInvalid={isError6} isRequired>
                            <FormLabel>Password-Confirm</FormLabel>
                            <Input
                                type='password'
                                placeholder='Re-enter your password'
                                value={password2}
                                onChange={(e) => {
                                    setPassword2(e.target.value)
                                }}
                            />
                            <div style={{ fontSize: 12, color: 'red' }}>{password2Err}</div>
                            {!isError6 ? (
                                <FormHelperText>Please match the password</FormHelperText>
                            ) : (
                                <FormErrorMessage>Password re-entry is required</FormErrorMessage>
                            )}
                        </FormControl>
                    </form>
                    <Center>
                        <Button size='lg' colorScheme='cyan' mt='24px' onClick={onClick}>
                            {/* <Link to='/Profile'>Complete Sign Up</Link> */}
                            complete
                        </Button>
                    </Center>
                </Box>
            </Box>
        </Flex>
    )
}

export default SignUpTab
