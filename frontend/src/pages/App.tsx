import {
    Box,
    Button,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    Stack,
    Wrap,
} from '@chakra-ui/react'
import { AVAStore } from '../data/DataStore'
import React, { useState } from 'react'
;(a, b, c) => {
    return a + b + c
}

function App() {
    const state = AVAStore.useState()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // const onClick = () => {
    //     AVAStore.update((s) => {
    //         s.counter++
    //     })
    // }

    const onClick = () => {
        fetch('https://webhook.site/716cccdb-800a-4459-9e3e-a551e503f8ab', {
            body: JSON.stringify({
                email,
            }),
            method: 'POST',
        })
    }

    return (
        <div className='App'>
            <header className='App-header'>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <Button onClick={onClick}>{state.counter}</Button>
                <a
                    className='App-link'
                    href='https://reactjs.org'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Learn React
                </a>

                <FormControl>
                    <FormLabel>Email address</FormLabel>
                    <Input
                        type='email'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                    <FormHelperText>We&apos;ll never share your email.</FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type='password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                    <FormHelperText>This is secure.</FormHelperText>
                </FormControl>

                <Button colorScheme='blue' onClick={onClick}>
                    Send Email
                </Button>

                <Wrap>
                    <Box w={['100%', '30%']} h='100px' background='blue'></Box>
                    <Box w={['100%', '30%']} h='100px' background='red'></Box>
                    <Box w={['100%', '30%']} h='100px' background='yellow'></Box>
                </Wrap>
            </header>
        </div>
    )
}

export default App
