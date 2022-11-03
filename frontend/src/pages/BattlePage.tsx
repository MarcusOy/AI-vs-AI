import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Center,
    Box,
    Text,
    Flex,
    Spacer,
    FormControl,
    FormLabel,
    Input,
    Button,
    HStack,
    ButtonGroup,
    Tab,
    TabList,
    Tabs,
    Stack,
    Avatar,
    Heading,
    TabPanel,
    TabPanels,
    Spinner,
    AlertDescription,
    AlertIcon,
    Alert,
    AlertTitle,
    Link,
    MenuItem,
    UnorderedList,
    ListItem,
} from '@chakra-ui/react'

import useAVAFetch from '../helpers/useAVAFetch'
import EditFullName from '../components/profile/EditFullName'
import { Battle } from '../models/battle'
import { WarningIcon } from '@chakra-ui/icons'
import { randomColor } from '@chakra-ui/theme-tools'
import { TbSword } from 'react-icons/tb'
import ProfileAndStratBattlesTab from './profile/ProfileAndStratBattlesTab'

const BattlePage = () => {
    const [id, setid] = useState('')
    const { data, isLoading, error, execute } = useAVAFetch(`/Battle/${id}`)
    const navigate = useNavigate()
    const battle: Battle = data

    const date = battle.createdOn

    if (isLoading || battle == undefined) {
        return (
            <Center mt='10'>
                <Spinner />
            </Center>
        )
    }
    if (error)
        return (
            <Center>
                <Stack spacing='10'>
                    <Stack mt='48' alignItems='center'>
                        <WarningIcon w={50} h={50} />
                        <Text fontSize='5xl'>Battle not found</Text>
                        <Text fontSize='lg'>The battle you are looking for was not found.</Text>
                        <Link onClick={() => history.back()} color='teal.500'>
                            Go back to where you came from.
                        </Link>
                    </Stack>
                    <Alert status='error'>
                        <AlertIcon />
                        <AlertTitle>Error.</AlertTitle>
                        <AlertDescription>{error?.response?.data}</AlertDescription>
                    </Alert>
                </Stack>
            </Center>
        )

    return (
        <Stack>
            <HStack>
                <Avatar
                    size='xl'
                    bg={randomColor({ string: battle.name })}
                    icon={<TbSword size='25' />}
                />
                <Stack spacing='0'>
                    {/* {isSelf ? <EditFullName /> : <Heading>{strategy.name}</Heading>} */}

                    <Heading fontSize='lg' mt={0}>
                        {battle.name}
                    </Heading>
                    <Heading fontSize='md'>Statistics of {battle.name}</Heading>
                </Stack>

                {/* <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Actions
            </MenuButton>
            <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem onClick={onSubmit}>
                    {strategy.isPrivate ? 'Set Private' : 'Set Public'}
                </MenuItem>
            </MenuList>
        </Menu> */}
            </HStack>
            <Box marginLeft={10}>
                <UnorderedList>
                    <ListItem>Battle created on: {}</ListItem>
                    <ListItem>Battle Status: {battle.battleStatus}</ListItem>
                    <ListItem>
                        Battle winner: {battle.defenderWins ? 'Defender' : 'Attacker'}
                    </ListItem>
                    <ListItem>Battle Attacking Strategy: {battle.attackingStrategy.name}</ListItem>
                    <ListItem>Battle Defending Strategy: {battle.defendingStrategy.name}</ListItem>
                </UnorderedList>
            </Box>
            <Box>
                <ProfileAndStratBattlesTab />
            </Box>
        </Stack>
    )
}

export default BattlePage
