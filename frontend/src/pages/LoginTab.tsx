import React, { useState } from 'react'
import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Center,
    Heading,
    Button,
    Stack,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import Form from '../components/Form'
import FormTextBox from '../components/FormTextBox'
import useAVAFetch from '../helpers/useAVAFetch'
import IdentityService from '../data/IdentityService'

interface ILoginForm {
    username: string
    password: string
}

const LoginTab = () => {
    const { data, isLoading, error, execute } = useAVAFetch(
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
                            <FormTextBox name='username' inputProps={{ placeholder: 'Username' }} />
                            <FormTextBox
                                name='password'
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
                    <Center>
                        {/* <Button size='lg' colorScheme='cyan' mt='24px' type='submit'>
                            <Link to='/Profile'>Log In</Link> 
                        </Button> */}
                    </Center>
                </Box>
            </Box>
        </Flex>
    )
}

export default LoginTab
