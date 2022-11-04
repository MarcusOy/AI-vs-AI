import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Center,
    Box,
    Text,
    Button,
    HStack,
    Stack,
    Avatar,
    Heading,
    Spinner,
    Divider,
} from '@chakra-ui/react'
import { randomColor } from '@chakra-ui/theme-tools'
import useAVAFetch from '../helpers/useAVAFetch'
import { Battle } from '../models/battle'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { TbSwords } from 'react-icons/tb'
import GameboardViewer from '../components/GameboardViewer'
import { BOARD_SIZES } from './ReplayPage'

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
                    const finalBoard = JSON.parse(g.finalBoard) as string[][]
                    return (
                        <Button
                            key={i}
                            colorScheme='gray'
                            onClick={() => navigate(`/Replay/${g.battleId}/${g.gameNumber}`)}
                            rightIcon={<ChevronRightIcon />}
                            height='12rem'
                            p={10}
                        >
                            <GameboardViewer
                                type='Non-interactive'
                                size={BOARD_SIZES.RECAP}
                                board={finalBoard}
                            />
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
