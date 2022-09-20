import React, { useState } from 'react'
import { Box, Flex, FormControl, FormLabel, Input, Center, Heading, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
const LoginTab = () => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const onClick = () => {
        fetch('https://webhook.site/f87e51c8-9a3a-4836-8603-6047d18985e6', {
            body: JSON.stringify({
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
                        <Heading color=''>Glad to see you</Heading>
                    </Box>
                </Center>
                <Box>
                    <form>
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
                    </form>
                    <Center>
                        <Button size='lg' colorScheme='cyan' mt='24px' onClick={onClick}>
                            <Link to='/Profile'>Log In</Link> {/* to mainpage */}
                        </Button>
                    </Center>
                </Box>
            </Box>
        </Flex>
    )
}

export default LoginTab
