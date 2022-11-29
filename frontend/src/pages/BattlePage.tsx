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
import { TbBook2, TbShield, TbSword, TbTrophy } from 'react-icons/tb'
import GameboardViewer, { GAME_COLORS } from '../components/GameboardViewer'
import { BOARD_SIZES } from './ReplayPage'
import { IoFlask } from 'react-icons/io5'

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
        <Stack mx='100'>
            {battle.isTestSubmission && (
                <HStack justifyContent='center'>
                    <IoFlask />
                    <Heading fontSize='md'>Test Submission Battle</Heading>
                </HStack>
            )}
            {!battle.isTestSubmission && (
                <HStack justifyContent='center'>
                    <TbTrophy />
                    <Heading fontSize='md'>Ranked Battle</Heading>
                </HStack>
            )}

            <Text fontSize='sm' textAlign='center'>
                {new Date(`${battle.createdOn}`).toLocaleString('en-us', {
                    dateStyle: 'full',
                    timeStyle: 'long',
                })}
            </Text>
            <HStack spacing='5' justifyContent='center' alignItems='start'>
                <Stack
                    as='a'
                    onClick={() => navigate(`/Strategy/${battle.attackingStrategyId}/Stats`)}
                    cursor='pointer'
                    borderRadius='5'
                    _hover={{
                        backgroundColor: 'whiteAlpha.100',
                        transition: 'background-color 200ms',
                    }}
                    p='3'
                    alignItems='center'
                >
                    <Avatar
                        size='lg'
                        bg={randomColor({ string: battle.attackingStrategy.name })}
                        icon={<TbBook2 size='30' />}
                    />
                    <HStack>
                        <TbSword size='30' />
                        <Text fontSize='xl' textAlign='center'>
                            {battle.attackingStrategy.name}
                        </Text>
                    </HStack>
                </Stack>
                <HStack fontSize={'5xl'} fontWeight='black' spacing='3'>
                    <Text>{battle.attackerWins}</Text>
                    <Text>-</Text>
                    <Text>{battle.defenderWins}</Text>
                </HStack>
                <Stack
                    as='a'
                    onClick={() => navigate(`/Strategy/${battle.defendingStrategyId}/Stats`)}
                    cursor='pointer'
                    borderRadius='5'
                    _hover={{
                        backgroundColor: 'whiteAlpha.100',
                        transition: 'background-color 200ms',
                    }}
                    p='3'
                    alignItems='center'
                >
                    <Avatar
                        size='lg'
                        bg={randomColor({ string: battle.defendingStrategy.name })}
                        icon={<TbBook2 size='30' />}
                    />
                    <HStack>
                        <Text fontSize='xl' textAlign='center'>
                            {battle.defendingStrategy.name}
                        </Text>
                        <TbShield size='30' />
                    </HStack>
                </Stack>
            </HStack>

            <Divider pt='3' />
            <Stack>
                {battle.battleGames.map((g, i) => {
                    const finalBoard = JSON.parse(g.finalBoard) as string[][]

                    const didWhiteWin =
                        (g.isAttackerWhite && g.didAttackerWin) ||
                        (!g.isAttackerWhite && !g.didAttackerWin)
                    const didBlackWin = !didWhiteWin

                    const didWinByElimination: boolean = g.didAttackerWin
                        ? g.defenderPawnsLeft == 0
                        : g.attackerPawnsLeft == 0

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
                                <HStack>
                                    <Box
                                        w='5'
                                        h='5'
                                        borderRadius='5'
                                        borderColor={GAME_COLORS.BLACK_PIECE.STROKE}
                                        borderWidth='2px'
                                        backgroundColor={GAME_COLORS.BLACK_PIECE.FILL}
                                    />
                                    {!g.isAttackerWhite ? (
                                        <TbSword size='15' />
                                    ) : (
                                        <TbShield size='15' />
                                    )}
                                    <Text fontWeight={didBlackWin ? 'bolder' : 'normal'}>
                                        {!g.isAttackerWhite
                                            ? battle.attackingStrategy.name
                                            : battle.defendingStrategy.name}
                                    </Text>
                                </HStack>
                                <HStack>
                                    <Box
                                        w='5'
                                        h='5'
                                        borderRadius='5'
                                        borderColor={GAME_COLORS.WHITE_PIECE.STROKE}
                                        borderWidth='2px'
                                        backgroundColor={GAME_COLORS.WHITE_PIECE.FILL}
                                    />
                                    {g.isAttackerWhite ? (
                                        <TbSword size='15' />
                                    ) : (
                                        <TbShield size='15' />
                                    )}
                                    <Text fontWeight={didWhiteWin ? 'bolder' : 'normal'}>
                                        {g.isAttackerWhite
                                            ? battle.attackingStrategy.name
                                            : battle.defendingStrategy.name}
                                    </Text>
                                </HStack>
                                <Text fontSize='xs'>
                                    {didBlackWin ? 'Black' : 'White'} won by{' '}
                                    {didWinByElimination
                                        ? `eliminating  ${didBlackWin ? 'White' : 'Black'}'s pawns`
                                        : 'scoring a touchdown (or other cases).'}
                                </Text>
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
