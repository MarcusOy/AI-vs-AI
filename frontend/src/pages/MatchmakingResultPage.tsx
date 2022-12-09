/* eslint-disable indent */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Box,
    Stack,
    Avatar,
    Text,
    HStack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Spinner,
    Center,
    Link,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Heading,
} from '@chakra-ui/react'
import { AVAStore } from '../data/DataStore'
import useAVAFetch from '../helpers/useAVAFetch'
import { Strategy } from '../models/strategy'

interface StrategyResult {
    strategy: Strategy
}
const MatchmakingResultPage = () => {
    interface results {
        win: number
        loss: number
    }
    const { id } = useParams()
    const { isLoading, data } = useAVAFetch('/GetStats/StratId/' + id)
    const [stats, setStats] = useState<result>({ wins: 0, losses: -1 })
    useEffect(() => {
        if (!isLoading) {
            setStats(data)
        }
    }, [isLoading])

    return (
        <Box mx='160'>
            <Heading size='lg' fontSize='50px'>This is the result of your Strategy</Heading>
            <Box mx='160' display='flex' alignItems='baseline'>
                <Heading size='lg' fontSize='40px'>Number of games Won: {stats.win}</Heading>
                <Box mx='100' display='flex' alignItems='baseline'>
                <Heading size='lg' fontSize='40px'>Number of games Loss: {stats.loss}</Heading>
                </Box>
            </Box>
           
        </Box>
    )
}

export default MatchmakingResultPage
