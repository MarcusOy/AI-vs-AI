import React from 'react'
import {
    Box,
    Center,
    Heading,
    Button,
    Stack,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
} from '@chakra-ui/react'
import { SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import Form from '../../components/Form'
import FormTextBox from '../../components/FormTextBox'
import useAVAFetch from '../../helpers/useAVAFetch'
import { useNavigate } from 'react-router-dom'
import IdentityService from '../../data/IdentityService'

interface ILoginForm {
    username: string
    password: string
}

const LoginTab = () => {
    const navigate = useNavigate()
    const { isLoading, error, execute } = useAVAFetch(
        '/Account/Login',
        { method: 'POST' },
        { manual: true }, // makes sure this request fires on user action
    )

    const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
        const response = await execute({ data })
        if (response.status == 200) {
            IdentityService.refreshIdentity()
            navigate('/')
        }
    }
    const onError: SubmitErrorHandler<ILoginForm> = (err, e) => console.error({ err, e })

    return (
        <Form onFormSubmit={onSubmit} onFormError={onError}>
            <Stack spacing='3'>
                <Center>
                    <Box>
                        <Heading color=''>Glad to see you</Heading>
                    </Box>
                </Center>
                {error && (
                    <Alert status='error'>
                        <AlertIcon />
                        <AlertTitle>Login Failed.</AlertTitle>
                        <AlertDescription>{error?.response?.data}</AlertDescription>
                    </Alert>
                )}
                <FormTextBox
                    name='username'
                    label='Username'
                    controlProps={{ isRequired: true }}
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
                    controlProps={{ isRequired: true }}
                    inputProps={{ placeholder: '***********', type: 'password' }}
                    validationProps={{
                        required: 'Password is required.',
                        minLength: {
                            value: 7,
                            message: 'Password must be longer than 6 characters.',
                        },
                    }}
                />
                <Button size='lg' mt='24px' type='submit' isLoading={isLoading}>
                    Login
                </Button>
            </Stack>
        </Form>
    )
}

export default LoginTab
