import React, { useState } from 'react'
import {
    Input,
    Flex,
    Box,
    FormControl,
    FormLabel,
    Button,
    Center,
    Heading,
    FormErrorMessage,
    FormHelperText,
    Alert,
    AlertIcon,
    Stack,
} from '@chakra-ui/react'

const profilePage = () => {
    const onClick = () => {
        fetch('https://localhost/WhoAmI', {
            credentials: 'include',
        })
    }

    return (
        <Stack>
            <Center>
                <Heading>THIS IS Profile page</Heading>
            </Center>
            <Button size='lg' colorScheme='cyan' mt='24px' onClick={onClick}>
                Who Am I?
            </Button>
        </Stack>
    )
}

export default profilePage
