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
    HStack,
    Stack,
    ButtonGroup,
} from '@chakra-ui/react'

import useAVAFetch from '../helpers/useAVAFetch'
import { AVAStore } from '../data/DataStore'

const StratPage = () => {
    const [id, setid] = useState('')
    const { data, isLoading, execute } = useAVAFetch(
        `/GetStats/${id}`,
        { method: 'POST' },
        { manual: true }, // makes sure this request fires on user action
    )
    const navigate = useNavigate()
    return (
        <Center>
            <Box>
                <Box>
                    <FormControl isRequired>
                        <Center>
                            <FormLabel>Enter Strategy Id</FormLabel>
                        </Center>

                        <Input
                            mt='10px'
                            htmlSize={30}
                            width='auto'
                            size='md'
                            placeholder='Enter your strategy id here'
                        />
                    </FormControl>
                </Box>
                <Center>
                    <ButtonGroup>
                        <Button size='md' mt='20px' type='submit' isLoading={isLoading}>
                            Search Strategy
                        </Button>
                        <Button
                            colorScheme='red'
                            size='md'
                            mt='20px'
                            onClick={() => navigate(`/Profile/${id}`)}
                        >
                            Back To Profile
                        </Button>
                    </ButtonGroup>
                </Center>
            </Box>
        </Center>
    )
}

export default StratPage
