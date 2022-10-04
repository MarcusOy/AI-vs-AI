import React from 'react'
import { Center, Box, Heading, Text, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
const WelcomePage = () => {
    return (
        <Center>
            <Box maxW='32rem'>
                <Heading mb={4}>AI vs AI: A Platform Full Of Strategies and Battles</Heading>
                <Text fontSize='xl'>
                    Placeholder landing page. Full landing page incoming in a future sprint.
                </Text>
                <br />
                <Text fontSize='lg'>
                    A Real Good Platform, hope everyone enjoy AI vs AI --SWE from cs407
                </Text>
                <Center>
                    <Link to='/Auth/Login'>
                        <Button size='lg' mt='24px'>
                            Login/Create a free account
                        </Button>
                    </Link>
                </Center>
            </Box>
        </Center>
    )
}

export default WelcomePage
