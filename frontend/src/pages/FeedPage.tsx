import React from 'react'
import { Center, Box, Text, Flex, Spacer, Heading, Button } from '@chakra-ui/react'
import ModalAi from './ModalAi'
import { Link } from 'react-router-dom'
const FeedPage = () => {
    return (
        <Box>
            {/* <Heading mb={4}>AI vs AI: A Platform Full Of Strategies and Battles</Heading>
                <Text fontSize='xl'>
                    A Real Good Platform, hope everyone enjoy AI vs AI --SWE from cs407
                </Text>
                <Center>
                    <Link to='/LoginSignup'>
                        <Button size='lg' mt='24px'>
                            Login/Create a free account
                        </Button>
                    </Link>
    </Center> */}
            <Flex>
                <Box>{<ModalAi />}</Box>
                <Spacer />
                <Box>
                    <Text>Feed page</Text>
                    <Link to='/Replay'> Replay Test </Link>
                </Box>
                <Spacer />
            </Flex>
        </Box>
    )
}

export default FeedPage
