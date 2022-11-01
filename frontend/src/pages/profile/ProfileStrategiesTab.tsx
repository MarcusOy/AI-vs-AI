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
import { User } from '../../models/user'
import { ChevronDownIcon, ChevronRightIcon, WarningIcon } from '@chakra-ui/icons'
import { TbBook2, TbSwords } from 'react-icons/tb'
import { randomColor } from '@chakra-ui/theme-tools'

interface IProfileStrategiesTabProps {
    user: User
}

const ProfileStrategiesTab = (p: IProfileStrategiesTabProps) => {
    const navigate = useNavigate()

    const strategies = p.user.strategies

    if (strategies == null || strategies.length <= 0)
        return (
            <Center>
                <Stack mt='48' alignItems='center'>
                    <WarningIcon w={50} h={50} />
                    <Text fontSize='5xl'>No strategies</Text>
                    <Text fontSize='lg'>This user does not have any strategies.</Text>
                    {/* <Text color='teal.500'>
                        <RouterLink to='/'>Go back to the home page.</RouterLink>
                    </Text> */}
                </Stack>
            </Center>
        )

    return (
        <Stack>
            {strategies.map((s, i) => {
                return (
                    <Button
                        key={i}
                        colorScheme='gray'
                        onClick={() => navigate(`/Strategy/${s.id}/Stats`)}
                        rightIcon={<ChevronRightIcon />}
                        p={10}
                    >
                        <Avatar bg={randomColor({ string: s.name })} icon={<TbBook2 size='25' />} />
                        <Stack spacing='0.2rem' textAlign='left' ml={5}>
                            <Text>{s.name}</Text>
                            <Text fontSize='xs'>{s.game?.name}</Text>
                        </Stack>
                        <Box flexGrow={1} />
                    </Button>
                )
            })}
        </Stack>
    )
}

export default ProfileStrategiesTab
