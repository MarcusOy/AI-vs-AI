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
    const isPrivate = p.strategy.isPrivate

    return (
        <Stack>
            <Heading fontSize='xxx-large'>Statistics of {strategyName}</Heading>
            <Box>
                <UnorderedList>
                    <ListItem fontSize='xx-large'>Strategy created by: {username}</ListItem>
                    <ListItem fontSize='xx-large'>Strategy Version: {version}</ListItem>
                    <ListItem fontSize='xx-large'>Strategy in game: {game}</ListItem>
                    <ListItem fontSize='xx-large'>
                        Strategy Status: {isPrivate ? 'Private' : 'Public'}
                    </ListItem>
                </UnorderedList>
            </Box>
        </Stack>
    )
}

export default StrategyStatTab
