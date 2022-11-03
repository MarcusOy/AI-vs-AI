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
    ButtonGroup,
    Tab,
    TabList,
    Tabs,
    Stack,
    Avatar,
    Heading,
    TabPanel,
    TabPanels,
    Spinner,
} from '@chakra-ui/react'

import useAVAFetch from '../helpers/useAVAFetch'
import EditFullName from '../components/profile/EditFullName'
import { Battle } from '../models/battle'
import { ChevronRightIcon } from '@chakra-ui/icons'

const BattlePage = () => {
    const { id } = useParams()
    const { data, isLoading, error } = useAVAFetch(`/Battle/${id}`)
    const navigate = useNavigate()

    const battle = data as Battle

    if (isLoading || battle == undefined)
        return (
            <Center mt='10'>
                <Spinner />
            </Center>
        )

    return (
        <Stack>
            {battle.battleGames.map((g, i) => {
                return (
                    <Button
                        key={i}
                        colorScheme='gray'
                        onClick={() => navigate(`/Replay/${g.battleId}/${g.gameNumber}`)}
                        rightIcon={<ChevronRightIcon />}
                        p={10}
                    >
                        {/* <GameBoardViewer/> */}
                        <Stack spacing='0.2rem' textAlign='left' ml={5}>
                            <Text>Game {g.gameNumber}</Text>
                            <Text fontSize='xs'>Win/Loss Placeholder</Text>
                        </Stack>
                        <Box flexGrow={1} />
                    </Button>
                )
            })}
        </Stack>
    )
}

export default BattlePage
