import React from 'react'
import {
    Box,
    Flex,
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
import Form from '../components/Form'
import FormTextBox from '../components/FormTextBox'
import useAVAFetch from '../helpers/useAVAFetch'
import IdentityService from '../data/IdentityService'

interface ILoginForm {
    username: string
    password: string
}

const LoginTab = () => {
    const { isLoading, error, execute } = useAVAFetch(
        '/Login',
        { method: 'POST' },
        { manual: true }, // makes sure this request fires on user action
    )

    const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
        const response = await execute({ data })
        if (response.status == 200) IdentityService.onLogin()
    }
    const onError: SubmitErrorHandler<ILoginForm> = (err, e) => console.error({ err, e })

    return (
        <Flex>
            <Box>
                <Center>
                    <Box>
                        <Heading color=''>Glad to see you</Heading>
                    </Box>
                </Center>
                <Box>
                    <Form onFormSubmit={onSubmit} onFormError={onError}>
                        <Stack spacing='2'>
                            {error && (
                                <Alert status='error'>
                                    <AlertIcon />
                                    <AlertTitle>Login Failed.</AlertTitle>
                                    <AlertDescription>{error?.message}</AlertDescription>
                                </Alert>
                            )}
                            <FormTextBox
                                name='username'
                                label='Username'
                                controlProps={{ isRequired: true }}
                                inputProps={{ placeholder: 'Ex: johndoe' }}
                            />
                            <FormTextBox
                                name='password'
                                label='Password'
                                controlProps={{ isRequired: true }}
                                inputProps={{ placeholder: '***********', type: 'password' }}
                            />
                            <Button
                                size='lg'
                                colorScheme='cyan'
                                mt='24px'
                                type='submit'
                                isLoading={isLoading}
                            >
                                Login
                            </Button>
                        </Stack>
                    </Form>
                </Box>
            </Box>
        </Flex>
    )
}

export default LoginTab
