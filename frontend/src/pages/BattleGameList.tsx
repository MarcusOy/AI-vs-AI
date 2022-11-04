import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AVAStore } from '../data/DataStore'
import IdentityService from '../data/IdentityService'
import useAVAFetch from '../helpers/useAVAFetch'

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
import { User } from '../models/user'
import { randomColor } from '@chakra-ui/theme-tools'
import { TbBook2, TbSwords } from 'react-icons/tb'
import { BattleGame } from '../models/battle-game'

interface IProfileBattleGameProps {
    battleId?: string
}

const BattleGameList = (p: IProfileBattleGameProps) => {
    const navigate = useNavigate()
    const { data, error, isLoading } = useAVAFetch('/Battles', {
        params: {
            battleId: p.battleId,
        },
    })

    const battleGames: BattleGame[] = data

    if (battleGames == null || battleGames.length <= 0)
        return (
            <Center>
                <Stack mt='48' alignItems='center'>
                    <WarningIcon w={50} h={50} />
                    <Text fontSize='5xl'>No battles</Text>
                    <Text fontSize='lg'>This battle does not have any battle games.</Text>
                    {/* <Text color='teal.500'>
                    <RouterLink to='/'>Go back to the home page.</RouterLink>
                </Text> */}
                </Stack>
            </Center>
        )

    return (
        <Stack>
            {battleGames.map((b, i) => {
                return (
                    <Button
                        key={i}
                        colorScheme='gray'
                        onClick={() => navigate(`/BattleGame/${b.battleId}`)}
                        rightIcon={<ChevronRightIcon />}
                        p={10}
                    >
                        <Avatar
                            bg={randomColor({ string: b.battleId })}
                            icon={<TbSwords size='25' />}
                        />
                        <Stack spacing='0.2rem' textAlign='left' ml={5}>
                            <Text>Game Number {b.gameNumber}</Text>
                            <Text fontSize='xs'>
                                Attacker wins: {b.didAttackerWin} | Defender wins:{' '}
                                {!b.didAttackerWin}
                            </Text>
                        </Stack>
                        <Box flexGrow={1} />
                    </Button>
                )
            })}
        </Stack>
    )
}

export default BattleGameList
