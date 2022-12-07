import React from 'react'
import { Center, Box, Text, Flex, Spacer, Heading, Button, HStack } from '@chakra-ui/react'
import ModalAi from './ModalAi'
import { Link, useNavigate } from 'react-router-dom'
import useAVAFetch from '../helpers/useAVAFetch'

const LeaderBoardPage = () => {
    const navigate = useNavigate()
    const { data, isLoading, error, execute } = useAVAFetch('/Leaderboard/Get/1')
    return (
        <Center>
            <Flex>
                <Heading size='md' fontSize='50px' color='cyan'>
                    Top 10 LeaderBoard For ...
                </Heading>
            </Flex>
        </Center>
    )
}

export default LeaderBoardPage
