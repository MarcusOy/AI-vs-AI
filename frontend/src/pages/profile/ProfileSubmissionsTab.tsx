import React from 'react'
import {
    Center,
    Box,
    Text,
    Stack,
    Button,
    Divider,
    HStack,
    Heading,
    Spinner,
    Spacer,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import useAVAFetch from '../../helpers/useAVAFetch'
import { ChevronRightIcon, WarningIcon } from '@chakra-ui/icons'
import { Battle } from '../../models/battle'
import GameboardViewer, { GAME_COLORS } from '../../components/GameboardViewer'
import { BOARD_SIZES } from '../ReplayPage'
import { TbShield, TbSword } from 'react-icons/tb'
import { BattleStatus } from '../../models/battle-status'
import { IoAlertCircle, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'

const groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        ;(rv[x[key]] = rv[x[key]] || []).push(x)
        return rv
    }, {})
}

const winColorProps = {
    backgroundColor: 'rgba(68, 220, 255, 0.20)',
    _hover: {
        backgroundColor: 'rgba(68, 220, 255, 0.45)',
    },
}

interface IProfileSubmissionsTab {
    userId: string
}

const ProfileSubmissionsTab = (p: IProfileSubmissionsTab) => {
    const navigate = useNavigate()
    const { data, error, isLoading } = useAVAFetch('/Battles', {
        params: {
            userId: p.userId,
            showOnlyTestSubmissions: true,
        },
    })

    if (isLoading)
        return (
            <Center>
                <Spinner />
            </Center>
        )

    if (data == null || data.length <= 0)
        return (
            <Center>
                <Stack mt='48' alignItems='center'>
                    <WarningIcon w={50} h={50} />
                    <Text fontSize='5xl'>No submissions</Text>
                    <Text fontSize='lg'>This user does not have any test submissions.</Text>
                </Stack>
            </Center>
        )

    const battles: Battle[] = data.map((b) => {
        const createdOnDate = new Date(b.createdOn).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        return {
            ...b,
            createdOnDate,
        }
    })
    const dates: Battle[][] = Object.values(groupBy(battles, 'createdOnDate'))

    return (
        <Center>
            <Stack spacing='5' flexGrow={1} maxW='3xl'>
                {dates.map((d, i) => {
                    return (
                        <>
                            <Stack key={i} spacing='1'>
                                <Text fontSize='sm'>{(d[0] as any).createdOnDate}</Text>
                                <Divider />
                            </Stack>
                            {d.map((b, i) => {
                                const didAttackerWin = b.attackerWins > b.defenderWins
                                const isAttacker = b.attackingStrategy.createdByUserId == p.userId
                                const colors =
                                    isAttacker && didAttackerWin
                                        ? winColorProps
                                        : !isAttacker && !didAttackerWin
                                        ? winColorProps
                                        : null

                                if (b.battleGames.length <= 0)
                                    return (
                                        <HStack
                                            key={i}
                                            p={4}
                                            spacing={4}
                                            borderRadius={4}
                                            backgroundColor='whiteAlpha.100'
                                        >
                                            <Spinner size='sm' />{' '}
                                            <Heading fontSize='md'>Pending {' - '}</Heading>
                                            <Text
                                                overflow='hidden'
                                                textOverflow='ellipsis'
                                                whiteSpace='nowrap'
                                            >
                                                vs.{' '}
                                                {b.defendingStrategy.name.length > 20
                                                    ? b.defendingStrategy.name.substring(0, 20) +
                                                      '...'
                                                    : b.defendingStrategy.name}
                                            </Text>
                                        </HStack>
                                    )

                                const g = b.battleGames[0]
                                const finalBoard = g ? (JSON.parse(g.finalBoard) as string[][]) : []

                                const didWhiteWin = g
                                    ? (g.isAttackerWhite && g.didAttackerWin) ||
                                      (!g.isAttackerWhite && !g.didAttackerWin)
                                    : false
                                const didBlackWin = !didWhiteWin

                                return (
                                    <HStack
                                        key={i}
                                        p={4}
                                        spacing={4}
                                        borderRadius={4}
                                        onClick={() => navigate(`/Replay/${b.id}/1`)}
                                        cursor='pointer'
                                        backgroundColor='whiteAlpha.100'
                                        _hover={{
                                            backgroundColor: 'whiteAlpha.200',
                                            transition: 'background-color 200ms',
                                        }}
                                        {...colors}
                                    >
                                        <Stack>
                                            {' '}
                                            <HStack>
                                                {b.battleStatus == BattleStatus.Fail ? (
                                                    <>
                                                        <IoAlertCircle size='20' color='red' />{' '}
                                                        <Heading fontSize='md'>
                                                            Fail {' - '}
                                                        </Heading>
                                                    </>
                                                ) : b.attackerWins > b.defenderWins ? (
                                                    <>
                                                        <IoCheckmarkCircle
                                                            size='20'
                                                            color='green'
                                                        />{' '}
                                                        <Heading fontSize='md'>
                                                            {' '}
                                                            Win {' - '}
                                                        </Heading>
                                                    </>
                                                ) : (
                                                    <>
                                                        <IoCloseCircle size='20' color='red' />{' '}
                                                        <Heading fontSize='md'>
                                                            Loss
                                                            {' - '}
                                                        </Heading>
                                                    </>
                                                )}
                                                <Text
                                                    overflow='hidden'
                                                    textOverflow='ellipsis'
                                                    whiteSpace='nowrap'
                                                >
                                                    vs.{' '}
                                                    {b.defendingStrategy.name.length > 20
                                                        ? b.defendingStrategy.name.substring(
                                                              0,
                                                              20,
                                                          ) + '...'
                                                        : b.defendingStrategy.name}
                                                </Text>
                                            </HStack>
                                            <HStack p={4} spacing={4}>
                                                <GameboardViewer
                                                    type='Non-interactive'
                                                    size={BOARD_SIZES.RECAP}
                                                    board={finalBoard}
                                                />
                                                <Stack spacing={1}>
                                                    <Heading size='lg'>
                                                        {g.didAttackerWin ? 'Win' : 'Loss'}
                                                    </Heading>
                                                    <HStack>
                                                        <Box
                                                            w='5'
                                                            h='5'
                                                            borderRadius='5'
                                                            borderColor={
                                                                GAME_COLORS.BLACK_PIECE.STROKE
                                                            }
                                                            borderWidth='2px'
                                                            backgroundColor={
                                                                GAME_COLORS.BLACK_PIECE.FILL
                                                            }
                                                            flexShrink={0}
                                                        />
                                                        {!g.isAttackerWhite ? (
                                                            <TbSword size='15' />
                                                        ) : (
                                                            <TbShield size='15' />
                                                        )}
                                                        <Text
                                                            fontWeight={
                                                                didBlackWin ? 'bolder' : 'normal'
                                                            }
                                                            overflow='hidden'
                                                            textOverflow='ellipsis'
                                                            whiteSpace='nowrap'
                                                        >
                                                            {!g.isAttackerWhite
                                                                ? b.attackingStrategy.name
                                                                : b.defendingStrategy.name}
                                                        </Text>
                                                    </HStack>
                                                    <HStack>
                                                        <Box
                                                            w='5'
                                                            h='5'
                                                            borderRadius='5'
                                                            borderColor={
                                                                GAME_COLORS.WHITE_PIECE.STROKE
                                                            }
                                                            borderWidth='2px'
                                                            backgroundColor={
                                                                GAME_COLORS.WHITE_PIECE.FILL
                                                            }
                                                            flexShrink={0}
                                                        />
                                                        {g.isAttackerWhite ? (
                                                            <TbSword size='15' />
                                                        ) : (
                                                            <TbShield size='15' />
                                                        )}
                                                        <Text
                                                            fontWeight={
                                                                didWhiteWin ? 'bolder' : 'normal'
                                                            }
                                                            overflow='hidden'
                                                            textOverflow='ellipsis'
                                                            whiteSpace='nowrap'
                                                        >
                                                            {g.isAttackerWhite
                                                                ? b.attackingStrategy.name
                                                                : b.defendingStrategy.name}
                                                        </Text>
                                                    </HStack>
                                                    {/* <Text fontSize='sm' fontWeight='bold'>
                                                    Turns:{' '}
                                                    <Text
                                                        as='span'
                                                        color='cyan.300'
                                                        fontWeight='normal'
                                                    >
                                                        {g.turns.length}
                                                    </Text>
                                                </Text> */}
                                                </Stack>
                                            </HStack>
                                        </Stack>
                                        <Spacer />
                                        <ChevronRightIcon />
                                    </HStack>
                                )
                            })}
                        </>
                    )
                })}
            </Stack>
        </Center>
    )
}

export default ProfileSubmissionsTab
