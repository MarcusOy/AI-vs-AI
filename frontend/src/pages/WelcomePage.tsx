import React from 'react'
import { Center, Box, Heading, Text, Button } from '@chakra-ui/react'

const WelcomePage = () => {
    return (
        <Center>
            <Box maxW='32rem'>
                <Heading mb={4}>AI vs AI: A Platform Full Of Strategies and Battles</Heading>
                <Text fontSize='xl'>
                    A Real Good Platform yessir, hope everyone enjoy AI vs AI --SWE from cs407
                </Text>
                <Center>
                    <Button size='lg' colorScheme='cyan' mt='24px'>
                        Create a free account
                    </Button>
                </Center>
            </Box>
        </Center>
    )
}

export default WelcomePage
