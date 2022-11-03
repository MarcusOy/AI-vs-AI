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
} from '@chakra-ui/react'

interface IStrategyPage {
    strategy: Strategy
}

const StrategyStatTab = (p: IStrategyPage) => {
    const strategyName = p.strategy.name
    const username = p.strategy.createdByUser?.username
    const version = p.strategy.version
    const game = p.strategy.game?.name

    return (
        <Stack>
            <Heading fontSize='md'>Statistics of {strategyName}</Heading>
            <Box marginLeft={10}>
                <UnorderedList>
                    <ListItem>Strategy created by: {username}</ListItem>
                    <ListItem>Strategy Version: {version}</ListItem>
                    <ListItem>Strategy in game: {game}</ListItem>
                    <ListItem>Strategy Status: private/public</ListItem>
                </UnorderedList>
            </Box>
        </Stack>
    )
}

export default StrategyStatTab
