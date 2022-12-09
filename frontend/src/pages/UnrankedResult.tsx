import React from 'react'
import {
    Center,
    Box,
    Text,
    Flex,
    Spacer,
    Heading,
    Button,
    HStack,
    Avatar,
    Spinner,
    Stack,
    Highlight,
    UnorderedList,
    ListItem,
} from '@chakra-ui/react'
import ModalAi from './ModalAi'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAVAFetch from '../helpers/useAVAFetch'
import { randomColor } from '@chakra-ui/theme-tools'
import { Battle } from '../models/battle'

const UnrankedResult = () => {
    const navigate = useNavigate()
    const { id1, id2 } = useParams()

    const { data, error, isLoading, execute } = useAVAFetch('/Strategy/ManualBattle', {
        method: 'POST',
        data: { AttackingStrategyId: id1, defendingStrategyId: id2 },
    })

    const battleId = data

    const battleFetch = useAVAFetch(`/Battle/${battleId}`)
    if (battleFetch.isLoading || battleFetch.error) {
        return <Spinner></Spinner>
    }
    const battleName = battleFetch.data.name
    return (
        <Stack>
            <Heading fontSize='xxx-large'>Result of {battleFetch.data.name}</Heading>
            <Box>
                <UnorderedList>
                    <ListItem fontSize='xx-large'>
                        Battle Winner is: {battleFetch.data.battle}
                    </ListItem>
                    <ListItem fontSize='xx-large'>Strategy Version: {}</ListItem>
                    <ListItem fontSize='xx-large'>Strategy in game: {}</ListItem>
                </UnorderedList>
            </Box>
        </Stack>
    )
}

export default UnrankedResult
