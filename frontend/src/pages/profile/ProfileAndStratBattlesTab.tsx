import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AVAStore } from '../../data/DataStore'
import IdentityService from '../../data/IdentityService'
import useAVAFetch from '../../helpers/useAVAFetch'

import {
    Center,
    Box,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Stack,
    MenuDivider,
    Avatar,
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronRightIcon, WarningIcon } from '@chakra-ui/icons'
import { User } from '../../models/user'
import { randomColor } from '@chakra-ui/theme-tools'
import { TbBook2, TbSwords } from 'react-icons/tb'
import { Battle } from '../../models/battle'

interface IProfileBattlesTabProps {
    userId?: string
    strategyId?: string
}

const ProfileAndStratBattlesTab = (p: IProfileBattlesTabProps) => {
    const navigate = useNavigate()
    const { data, error, isLoading } = useAVAFetch('/Battles', {
        params: {
            userId: p.userId,
            strategyId: p.strategyId,
        },
    })

    const battles: Battle[] = data

    if (battles == null || battles.length <= 0)
        return (
            <Center>
                <Stack mt='48' alignItems='center'>
                    <WarningIcon w={50} h={50} />
                    <Text fontSize='5xl'>No battles</Text>
                    <Text fontSize='lg'>
                        This {p.strategyId == null ? 'user' : 'strategy'} does not have any battles.
                    </Text>
                    {/* <Text color='teal.500'>
                    <RouterLink to='/'>Go back to the home page.</RouterLink>
                </Text> */}
                </Stack>
            </Center>
        )

    return (
        <Stack>
            {battles.map((b, i) => {
                return (
                    <Button
                        key={i}
                        colorScheme='gray'
                        onClick={() => navigate(`/Battle/${b.id}`)}
                        rightIcon={<ChevronRightIcon />}
                        p={10}
                    >
                        <Avatar
                            bg={randomColor({ string: b.name })}
                            icon={<TbSwords size='25' />}
                        />
                        <Stack spacing='0.2rem' textAlign='left' ml={5}>
                            <Text>{b.name}</Text>
                            <Text fontSize='xs'>
                                Attacker wins: {b.attackerWins} | Defender wins: {b.defenderWins}
                            </Text>
                        </Stack>
                        <Box flexGrow={1} />
                    </Button>
                )
            })}
        </Stack>
    )
}

export default ProfileAndStratBattlesTab
