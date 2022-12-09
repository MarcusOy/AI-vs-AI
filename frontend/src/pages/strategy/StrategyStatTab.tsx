import React from 'react'
import { Strategy } from '../../models/strategy'
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
    Heading,
    UnorderedList,
    ListItem,
    SimpleGrid,
    Stat,
    StatArrow,
    StatHelpText,
    StatLabel,
    StatNumber,
} from '@chakra-ui/react'
import { StrategyStatus } from '../../models/strategy-status'
import useAVAFetch from '../../helpers/useAVAFetch'
import { ProgrammingLanguage } from '../../models/programming-language'

interface IStrategyPage {
    strategy: Strategy
}

const StrategyStatTab = (p: IStrategyPage) => {
    const strategyName = p.strategy.name
    const username = p.strategy.createdByUser?.username
    const version = p.strategy.version
    const game = p.strategy.game?.name
    const isPrivate = p.strategy.isPrivate

    const { isLoading, data } = useAVAFetch('/GetStats/StratId/' + p.strategy.id)

    return (
        <Center>
            <Stack mt={10} spacing='5' flexGrow={1} maxW='3xl'>
                <SimpleGrid columns={2} spacing={5}>
                    <Box borderWidth={1} borderRadius={20} p={5} px={10}>
                        <Stat>
                            <StatLabel fontSize='xl'>Created by</StatLabel>
                            <StatNumber fontSize='4xl'>
                                {p.strategy.createdByUser?.firstName! +
                                    ' ' +
                                    p.strategy.createdByUser?.lastName!}
                            </StatNumber>
                            <StatHelpText fontSize='xl'>
                                <StatArrow type='increase' />
                                on {new Date(p.strategy.createdOn!).toLocaleString()}
                            </StatHelpText>
                        </Stat>
                    </Box>
                    <Box borderWidth={1} borderRadius={20} p={5} px={10}>
                        <Stat>
                            <StatLabel fontSize='xl'>Written in</StatLabel>
                            <StatNumber fontSize='4xl'>
                                {p.strategy.language == ProgrammingLanguage.JavaScript
                                    ? 'JavaScript'
                                    : 'TypeScript'}
                            </StatNumber>
                            <StatHelpText fontSize='xl'>
                                <StatArrow type='increase' />
                                Programming Language
                            </StatHelpText>
                        </Stat>
                    </Box>
                    <Box borderWidth={1} borderRadius={20} p={5} px={10}>
                        <Stat>
                            <StatLabel fontSize='xl'>Raw Elo Score</StatLabel>
                            <StatNumber fontSize='4xl'>
                                {p.strategy.status == StrategyStatus.Active
                                    ? p.strategy.elo
                                    : 'Unranked'}
                            </StatNumber>
                            <StatHelpText fontSize='xl'>
                                <StatArrow type='increase' />
                                23.36%
                            </StatHelpText>
                        </Stat>
                    </Box>
                    <Box borderWidth={1} borderRadius={20} p={5} px={10}>
                        <Stat>
                            <StatLabel fontSize='xl'>Leaderboard Rank</StatLabel>
                            <StatNumber fontSize='4xl'>
                                {p.strategy.status == StrategyStatus.Active
                                    ? 'RANKING HERE'
                                    : 'Unranked'}
                            </StatNumber>
                            <StatHelpText fontSize='xl'>
                                <StatArrow type='increase' />
                                1234Chess
                            </StatHelpText>
                        </Stat>
                    </Box>
                </SimpleGrid>
            </Stack>
        </Center>
    )
}

export default StrategyStatTab
