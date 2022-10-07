import React from 'react'
import { Center, Box, Text, Flex, Spacer } from '@chakra-ui/react'
import ModalAi from './ModalAi'
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
            <Box>
                    <ModalAi />
                </Box>
                <Spacer/>
                <Box>
                    <Text>Feed page</Text>
                </Box>
                <Spacer/>
                
                </Flex>
            </Box>
    )
}

export default FeedPage
