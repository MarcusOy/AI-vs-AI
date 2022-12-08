import React from 'react'
import { Center, Box, Heading, Text, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
const WelcomePage = () => {
    useDocumentTitle()
    return (
        <Center>
            <Box maxW='32rem'>
                <Heading mb={4}>AI vs AI: A Platform Full Of Strategies and Battles</Heading>
                <Text fontSize='xl'>
                    A Real Good Platform, hope everyone enjoy AI vs AI --SWE from cs407
                </Text>
                <Center>
                    <Button size='lg' mt='24px'>
                        <Link to='/Auth/Login'>Login/Create a free account</Link>
                    </Button>
                </Center>
            </Box>
        </Center>
    )
}

export default WelcomePage
