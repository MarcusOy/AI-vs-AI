import React, { useState } from 'react'

import { Input, Flex, Box, FormControl, FormLabel, Button, Center, Heading } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const SignUpTab = () => {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
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
                        <FormControl>
                            <FormLabel>First Name</FormLabel>
                            <Input
                                type='firstname'
                                placeholder='Enter your first name'
                                value={firstname}
                                onChange={(e) => {
                                    setFirstname(e.target.value)
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Last Name</FormLabel>
                            <Input
                                type='lastname'
                                placeholder='Enter your last name'
                                value={lastname}
                                onChange={(e) => {
                                    setLastname(e.target.value)
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type='email'
                                placeholder='Enter your email address'
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type='username'
                                placeholder='Enter your username'
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type='password'
                                placeholder='Enter your password'
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password-Confirm</FormLabel>
                            <Input type='password' placeholder='Re-enter your password' />
                        </FormControl>
                    </form>
                    <Center>
                        <Button size='lg' colorScheme='cyan' mt='24px' onClick={onClick}>
                            <Link to='/'>Complete Sign Up</Link> to mainpage
                        </Button>
                    </Center>
                </Box>
            </Box>
        </Flex>
    )
}

export default SignUpTab
