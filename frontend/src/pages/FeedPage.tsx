import React from 'react'
import { Center, Box, Text, Flex, Spacer, Heading, Button } from '@chakra-ui/react'
import ModalAi from './ModalAi'
import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
const FeedPage = () => {
    useDocumentTitle('Feed')

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
        </Flex>
    )
}

export default FeedPage
