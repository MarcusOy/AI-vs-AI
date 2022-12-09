import React from 'react'
import { useNavigate } from 'react-router-dom'

import {
    Center,
    Box,
    Text,
    Button,
    Stack,
    Avatar,
    Badge,
    Heading,
    HStack,
    Divider,
} from '@chakra-ui/react'
import { User } from '../../models/user'
import { ChevronRightIcon, WarningIcon } from '@chakra-ui/icons'
import { TbBook2 } from 'react-icons/tb'
import { randomColor } from '@chakra-ui/theme-tools'
import { StrategyStatus } from '../../models/strategy-status'

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
                </Stack>
            </Center>
        )

    const activeOrDraftStrategies = strategies.filter((s) => s.status != StrategyStatus.InActive)
    const archivedStrategies = strategies.filter((s) => s.status == StrategyStatus.InActive)

    return (
        <Center>
            <Stack mt={10} spacing='5' flexGrow={1} maxW='3xl'>
                {activeOrDraftStrategies.map((s, i) => {
                    return (
                        <Button
                            key={i}
                            colorScheme='gray'
                            onClick={() => navigate(`/Strategy/${s.id}/Stats`)}
                            rightIcon={<ChevronRightIcon />}
                            p={10}
                        >
                            <Avatar
                                bg={randomColor({ string: s.name })}
                                icon={<TbBook2 size='25' />}
                            />
                            <Stack spacing='0.2rem' textAlign='left' ml={5}>
                                <HStack>
                                    <Heading fontSize='md'>{s.name}</Heading>
                                    <Text ml={5}>v{s.version}</Text>
                                </HStack>

                                <Text fontSize='xs'>
                                    <span style={{ marginRight: 10 }}>{s.game?.name} </span>
                                    {s.status == StrategyStatus.Draft && (
                                        <Badge variant='outline' colorScheme='cyan'>
                                            Draft
                                        </Badge>
                                    )}
                                    {s.status == StrategyStatus.Active && (
                                        <Badge variant='solid' colorScheme='cyan'>
                                            Active
                                        </Badge>
                                    )}
                                    {s.status == StrategyStatus.InActive && (
                                        <Badge variant='subtle' colorScheme='cyan'>
                                            Inactive
                                        </Badge>
                                    )}
                                </Text>
                            </Stack>
                            <Box flexGrow={1} />
                        </Button>
                    )
                })}
                {archivedStrategies.length > 0 && (
                    <>
                        <Stack spacing='1'>
                            <Text fontSize='sm'>Archived strategies</Text>
                            <Divider />
                        </Stack>
                        {archivedStrategies.map((s, i) => {
                            return (
                                <Button
                                    key={i}
                                    colorScheme='gray'
                                    onClick={() => navigate(`/Strategy/${s.id}/Stats`)}
                                    rightIcon={<ChevronRightIcon />}
                                    p={10}
                                >
                                    <Avatar
                                        bg={randomColor({ string: s.name })}
                                        icon={<TbBook2 size='25' />}
                                    />
                                    <Stack spacing='0.2rem' textAlign='left' ml={5}>
                                        <HStack>
                                            <Heading fontSize='md'>{s.name}</Heading>
                                            <Text ml={5}>v{s.version}</Text>
                                        </HStack>

                                        <Text fontSize='xs'>
                                            <span style={{ marginRight: 10 }}>{s.game?.name} </span>
                                            {s.status == StrategyStatus.Draft && (
                                                <Badge variant='outline' colorScheme='cyan'>
                                                    Draft
                                                </Badge>
                                            )}
                                            {s.status == StrategyStatus.Active && (
                                                <Badge variant='solid' colorScheme='cyan'>
                                                    Active
                                                </Badge>
                                            )}
                                            {s.status == StrategyStatus.InActive && (
                                                <Badge variant='subtle' colorScheme='cyan'>
                                                    Inactive
                                                </Badge>
                                            )}
                                        </Text>
                                    </Stack>
                                    <Box flexGrow={1} />
                                </Button>
                            )
                        })}
                    </>
                )}
            </Stack>
        </Center>
    )
}

export default ProfileStrategiesTab
