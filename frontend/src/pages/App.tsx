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
import LoginSignUpPage from './LoginSignupPage'


function App() {
    // const state = AVAStore.useState()

    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')

    // const onClick = () => {
    //     AVAStore.update((s) => {
    //         s.counter++
    //     })
    // }

    // const onClick = () => {
    //     fetch('https://webhook.site/716cccdb-800a-4459-9e3e-a551e503f8ab', {
    //         body: JSON.stringify({
    //             email,
    //         }),
    //         method: 'POST',
    //     })
    // }

    return (
        <div className='App'>
            <LoginSignUpPage/>
        </div>
    )
}

export default App
