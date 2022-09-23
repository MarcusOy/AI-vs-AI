import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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
    Grid,
    GridItem,
    ButtonGroup,
    Spacer,
    Editable,
    EditableInput,
    EditablePreview,
    Textarea,
} from '@chakra-ui/react'

const userData = {
    username: 'AI Mitch Daniel',
}

const profilePage = () => {
    return (
        <div color='black'>
            <Center>
                <Box bg='black' padding='150' color='white'>
                    <Heading>Profile of MR.407</Heading>
                    <Flex paddingTop={10} minWidth='max-content' alignItems='center' gap='2'>
                        <Textarea placeholder='Here are something about me:' />
                    </Flex>
                    <Flex minWidth='max-content' alignItems='center' gap='2'>
                        <Box p='2'>
                            <Heading size='md' paddingTop={100}>
                                Account operation:
                            </Heading>
                        </Box>
                        <Spacer />
                        <ButtonGroup gap='2' paddingTop={100}>
                            <Button colorScheme='red'>Delete Account</Button>
                            <Button colorScheme='cyan'>
                                <Link to='/'>Log Out</Link>
                            </Button>
                        </ButtonGroup>
                    </Flex>
                    <Flex minWidth='max-content' alignItems='center' gap='2'>
                        <Box p='2'>
                            <Heading size='md' paddingTop={10}>
                                Username changing:
                            </Heading>
                        </Box>
                        <Spacer />
                        <ButtonGroup gap='2' paddingTop={10}>
                            <Input variant='flushed' placeholder='Enter new username' />
                            <Button colorScheme='green'>Confirm</Button>
                        </ButtonGroup>
                    </Flex>
                </Box>
            </Center>
        </div>
    )
}

export default profilePage
