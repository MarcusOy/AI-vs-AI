import React, { useState } from 'react'
import { Box, Flex, FormControl, FormLabel, Input, Center, Heading, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
const LoginTab = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const onClick = () => {
        fetch('https://localhost/Login', {
            body: JSON.stringify({
                username,
                password,
            }),
            method: 'POST',
            headers: [['Content-Type', 'application/json']],
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
