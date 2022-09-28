import React from 'react'

import { Flex, Box, Button, Center, Heading, Stack } from '@chakra-ui/react'
import Form from '../components/Form'
import { SubmitErrorHandler, SubmitHandler } from 'react-hook-form'
import FormTextBox from '../components/FormTextBox'

interface ISignupForm {
    firstname: string
    lastname: string
    email: string
    username: string
    password: string
    password2: string
}

const SignUpTab = () => {
    const onSubmit: SubmitHandler<ISignupForm> = async (data) => console.log({ data })
    const onError: SubmitErrorHandler<ISignupForm> = (err, e) => console.error({ err, e })

    return (
        <Flex>
            <Box>
                <Center>
                    <Box>
                        <Heading>Welcome, AI Creators</Heading>
                    </Box>
                </Center>
                <Box>
                    <Form onFormSubmit={onSubmit} onFormError={onError}>
                        <Stack spacing='2'>
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
                            {/* <FormTextBox
                                name='password2'
                                label='Confirm Password'
                                inputProps={{ placeholder: '***********', type: 'password' }}
                                validationProps={{
                                    required: 'Please confirm your password.',
                                }}
                            /> */}
                            <Center>
                                <Button size='lg' colorScheme='cyan' mt='24px' type='submit'>
                                    Complete sign up
                                </Button>
                            </Center>
                        </Stack>
                    </Form>
                    {/* <form onChange={handleChange}>
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
                    </form> */}
                </Box>
            </Box>
        </Flex>
    )
}

export default SignUpTab
