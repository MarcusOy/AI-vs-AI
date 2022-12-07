import React from 'react'
import { Center, Box, Text, Flex, Spacer, Heading, Button, HStack } from '@chakra-ui/react'
import ModalAi from './ModalAi'
import { Link, useNavigate } from 'react-router-dom'

const FeedPage = () => {
    const navigate = useNavigate()
    return (
        <Flex>
            <Box>
                <ModalAi overwrite={false} />
            </Box>
            <Spacer />
            <Box>
                <Text>🚧 Feed page 🚧</Text>
                <Link to='/ManualPlay'> Manual Play </Link>
            </Box>

            <Spacer />
            <HStack>
                <Button onClick={() => navigate('/LeaderBoard/1')}>
                    {' '}
                    Temporary LeaderBoard Button
                </Button>
            </HStack>
        </Flex>
    )
}

export default FeedPage
