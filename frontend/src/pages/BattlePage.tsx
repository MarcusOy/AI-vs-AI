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
    Divider,
} from '@chakra-ui/react'
import { randomColor } from '@chakra-ui/theme-tools'
import useAVAFetch from '../helpers/useAVAFetch'
import EditFullName from '../components/profile/EditFullName'
import { Battle } from '../models/battle'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { TbSwords } from 'react-icons/tb'

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
        <Stack mx='100' spacing='5'>
            <HStack>
                <Avatar
                    size='xl'
                    bg={randomColor({ string: battle.name })}
                    icon={<TbSwords size='50' />}
                />
                <Stack spacing='0'>
                    {/* {isSelf ? <EditFullName /> : <Heading>{strategy.name}</Heading>} */}

                    <Heading mt={0}>{battle.name}</Heading>
                </Stack>
                <Box flexGrow={1} />
            </HStack>
            <Divider />
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
        </Stack>
    )
}

export default BattlePage
