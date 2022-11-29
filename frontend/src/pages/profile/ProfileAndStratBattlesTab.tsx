import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAVAFetch from '../../helpers/useAVAFetch'
import { Center, Box, Text, Button, Stack, Avatar, HStack, Divider } from '@chakra-ui/react'
import { ChevronRightIcon, WarningIcon } from '@chakra-ui/icons'
import { randomColor } from '@chakra-ui/theme-tools'
import { TbShield, TbSword, TbSwords } from 'react-icons/tb'
import { Battle } from '../../models/battle'
import { AVAStore } from '../../data/DataStore'
import { GoTriangleLeft } from 'react-icons/go'

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

interface IProfileBattlesTabProps {
    userId?: string
    strategyId?: string
}

const ProfileAndStratBattlesTab = (p: IProfileBattlesTabProps) => {
    const { whoAmI } = AVAStore.useState()
    const navigate = useNavigate()
    const { data, error, isLoading } = useAVAFetch('/Battles', {
        params: {
            userId: p.userId,
            strategyId: p.strategyId,
        },
    })

    if (data == null || data.length <= 0)
        return (
            <Center>
                <Stack mt='48' alignItems='center'>
                    <WarningIcon w={50} h={50} />
                    <Text fontSize='5xl'>No battles</Text>
                    <Text fontSize='lg'>
                        This {p.strategyId == null ? 'user' : 'strategy'} does not have any battles.
                    </Text>
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
    console.log({ battles, dates })

    return (
        <Stack spacing='5'>
            {dates.map((d, i) => {
                return (
                    <>
                        <Stack key={i} spacing='1'>
                            <Text fontSize='sm'>{(d[0] as any).createdOnDate}</Text>
                            <Divider />
                        </Stack>
                        {d.map((b, i) => {
                            const name = b.name
                            const attacker = b.attackingStrategy.name
                            const defender = b.defendingStrategy.name
                            const didAttackerWin = b.attackerWins > b.defenderWins

                            const isAttacker = p.strategyId
                                ? b.attackingStrategyId == p.strategyId
                                : b.attackingStrategy.createdByUserId == p.userId

                            const colors =
                                isAttacker && didAttackerWin
                                    ? winColorProps
                                    : !isAttacker && !didAttackerWin
                                    ? winColorProps
                                    : null

                            return (
                                <Button
                                    key={i}
                                    colorScheme='gray'
                                    onClick={() => navigate(`/Battle/${b.id}`)}
                                    rightIcon={<ChevronRightIcon />}
                                    p={10}
                                    {...colors}
                                >
                                    <Avatar
                                        bg={randomColor({ string: name })}
                                        icon={<TbSwords size='25' />}
                                    />
                                    <Stack spacing='0.2rem' textAlign='left' ml={5}>
                                        <Stack>
                                            <HStack>
                                                <TbSword size='15' />
                                                <Text
                                                    fontWeight={
                                                        didAttackerWin ? 'bolder' : 'normal'
                                                    }
                                                >
                                                    {attacker}
                                                </Text>
                                            </HStack>
                                            <HStack>
                                                <TbShield size='15' />
                                                <Text
                                                    fontWeight={
                                                        didAttackerWin ? 'normal' : 'bolder'
                                                    }
                                                >
                                                    {defender}
                                                </Text>
                                            </HStack>
                                        </Stack>
                                    </Stack>
                                    <Box flexGrow={1} />
                                    <Stack>
                                        <HStack>
                                            <Text fontWeight={didAttackerWin ? 'bolder' : 'normal'}>
                                                {b.attackerWins}
                                            </Text>
                                            {didAttackerWin && <GoTriangleLeft />}
                                        </HStack>
                                        <HStack>
                                            <Text fontWeight={didAttackerWin ? 'normal' : 'bolder'}>
                                                {b.defenderWins}
                                            </Text>
                                            {!didAttackerWin && <GoTriangleLeft />}
                                        </HStack>
                                    </Stack>
                                    <Divider
                                        h='4rem'
                                        ml='0'
                                        mr='6'
                                        color='chakra-body-text'
                                        orientation='vertical'
                                    />
                                </Button>
                            )
                        })}
                    </>
                )
            })}
        </Stack>
    )
}

export default ProfileAndStratBattlesTab
