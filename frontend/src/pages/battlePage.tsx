import React, { useState } from 'react'
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom'
import {
    Center,
    Box,
    Text,
    Flex,
    Spacer,
    FormControl,
    FormLabel,
    Input,
    Button,
} from '@chakra-ui/react'

import useAVAFetch from '../helpers/useAVAFetch'
import { AVAStore } from '../data/DataStore'

const BattlePage = () => {
    const [id, setid] = useState('')
    const { data, isLoading, execute } = useAVAFetch(
        `/GetStats/${id}`,
        { method: 'POST' },
        { manual: true }, // makes sure this request fires on user action
    )
    return (
        <Box>
            <FormControl isRequired>
                <FormLabel>Enter Battle Id</FormLabel>
                <Input size='md' placeholder='Enter your battle id here' />
            </FormControl>
            <Center>
                <Button size='lg' mt='24px' type='submit' isLoading={isLoading}>
                    Search Battle
                </Button>
            </Center>
        </Box>
    )
}

export default BattlePage
