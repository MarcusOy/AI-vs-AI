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

    return (
        <Stack>
            <Heading fontSize='md'>Statistics of {strategyName}</Heading>
            <Box marginLeft={10}>
                <UnorderedList>
                    <ListItem>Strategy created by: {username}</ListItem>
                    <ListItem>Consectetur adipiscing elit</ListItem>
                    <ListItem>Integer molestie lorem at massa</ListItem>
                    <ListItem>Facilisis in pretium nisl aliquet</ListItem>
                </UnorderedList>
            </Box>
        </Stack>
    )
}

export default StrategyStatTab
