import React from 'react'

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Center,
    Heading,
    Stack,
    useToast,
} from '@chakra-ui/react'
import Form from '../components/Form'
import { SubmitErrorHandler, SubmitHandler } from 'react-hook-form'
import FormTextBox from '../components/FormTextBox'
import { useNavigate } from 'react-router-dom'
import useAVAFetch from '../helpers/useAVAFetch'

interface ISignupForm {
    firstname: string
    lastname: string
    email: string
    username: string
    password: string
    password2: string
}

const SignUpTab = () => {
    const navigate = useNavigate()
    const toast = useToast()
    const { isLoading, error, execute } = useAVAFetch(
        '/Account/Signup',
        { method: 'POST' },
        { manual: true }, // makes sure this request fires on user action
    )

    const onSubmit: SubmitHandler<ISignupForm> = async (data) => {
        const response = await execute({ data })
        if (response.status == 200) {
            toast({
                title: 'Account created.',
                description: 'Now login with your provided username and password.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            navigate('/Auth/Login')
        }
    }
    const onError: SubmitErrorHandler<ISignupForm> = (err, e) => console.error({ err, e })

    return (
        <Form onFormSubmit={onSubmit} onFormError={onError}>
            <Stack spacing='3'>
                <Center>
                    <Box>
                        <Heading>Welcome, AI Creators</Heading>
                    </Box>
                </Center>
                {error && (
                    <Alert status='error'>
                        <AlertIcon />
                        <AlertTitle>Signup Failed.</AlertTitle>
                        <AlertDescription>{error?.response?.data}</AlertDescription>
                    </Alert>
                )}
                <FormTextBox
                    name='firstname'
                    label='First Name'
                    inputProps={{ placeholder: 'Ex: John' }}
                    validationProps={{
                        required: 'First name is required.',
                    }}
                />
                <FormTextBox
                    name='lastname'
                    label='Last Name'
                    inputProps={{ placeholder: 'Ex: Doe' }}
                    validationProps={{
                        required: 'Last name is required.',
                    }}
                />
                <FormTextBox
                    name='email'
                    label='Email'
                    inputProps={{ placeholder: 'Ex: john@doe.com' }}
                    validationProps={{
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                            message: 'Enter a valid email.',
                        },
                        required: 'Email is required.',
                    }}
                />
                <FormTextBox
                    name='username'
                    label='Username'
                    inputProps={{ placeholder: 'Ex: johndoe' }}
                    validationProps={{
                        required: 'Username is required.',
                        maxLength: {
                            value: 15,
                            message: 'Username must be under 15 characters.',
                        },
                    }}
                />
                <FormTextBox
                    name='password'
                    label='Password'
                    inputProps={{ placeholder: '***********', type: 'password' }}
                    validationProps={{
                        required: 'Password is required.',
                        minLength: {
                            value: 7,
                            message: 'Password must be longer than 6 characters.',
                        },
                    }}
                />
                <Center>
                    <Button size='lg' mt='24px' type='submit' isLoading={isLoading}>
                        Signup
                    </Button>
                </Center>
            </Stack>
        </Form>
    )
}

export default SignUpTab
