import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Center,
    Box,
    Text,
    Link,
    Button,
    HStack,
    Stack,
    ButtonGroup,
    Avatar,
    Tab,
    TabList,
    Tabs,
    TabPanels,
    TabPanel,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Heading,
    Spinner,
    MenuButton,
    Menu,
    MenuItem,
    MenuList,
    useToast,
} from '@chakra-ui/react'
import { randomColor } from '@chakra-ui/theme-tools'
import StrategyStatTab from './StrategyStatTab'
import StrategySourceCodeTab from './StrategySourceCodeTab'
import useAVAFetch from '../../helpers/useAVAFetch'
import { ChevronDownIcon, WarningIcon, LockIcon, UnlockIcon, Icon } from '@chakra-ui/icons'
import EditFullName from '../../components/profile/EditFullName'
import { Strategy } from '../../models/strategy'
import { AVAStore } from '../../data/DataStore'
import { TbBook2 } from 'react-icons/tb'
import ProfileBattlesTab from '../profile/ProfileAndStratBattlesTab'
import { SubmitErrorHandler, SubmitHandler } from 'react-hook-form'

const StrategyPage = () => {
    const { whoAmI } = AVAStore.useState()
    const navigate = useNavigate()
    const { id, tab } = useParams()
    const { data, isLoading, error, execute } = useAVAFetch(`/Strategy/${id}`)
    const strategy: Strategy = data
    const toast = useToast()

    // const isSelf = strategy.createdByUserId == whoAmI?.id

    const index = tab == 'Stats' ? 0 : tab == 'SourceCode' ? 1 : tab == 'Battles' ? 2 : -1

    const handleTabsChange = (index) => {
        const tab = index == 1 ? 'SourceCode' : index == 2 ? 'Battles' : 'Stats'
        navigate(`/Strategy/${id}/${tab}`)
    }
    const visibilityRequest = useAVAFetch(
        '/Strategy/Update',
        { method: 'PUT' },
        { manual: true }, // makes sure this request fires on user action
    )

    const onSubmit = async () => {
        const newStrategy: Strategy = {
            ...strategy,
            isPrivate: !strategy.isPrivate,
        }
        const response = await visibilityRequest.execute({ data: newStrategy })
        if (response.status == 200) {
            execute()
            toast({
                title: 'Code visibility Statue changed Successful.',
                description: 'You just changed visibility.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        }
    }
    if (isLoading || strategy == undefined)
        return (
            <Center mt='10'>
                <Spinner />
            </Center>
        )
    if (error)
        return (
            <Center>
                <Stack spacing='10'>
                    <Stack mt='48' alignItems='center'>
                        <WarningIcon w={50} h={50} />
                        <Text fontSize='5xl'>Strategy not found</Text>
                        <Text fontSize='lg'>The strategy you are looking for was not found.</Text>
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
        <Box>
            <Box mx='100'>
                <HStack>
                    <Avatar
                        size='2xl'
                        bg={randomColor({ string: strategy.name })}
                        icon={<TbBook2 size='25' />}
                    />
                    <Stack spacing='0'>
                        {/* {isSelf ? <EditFullName /> : <Heading>{strategy.name}</Heading>} */}
                        <HStack>
                            <Heading fontSize='4xl' mt={0}>
                                {strategy.name}
                            </Heading>
                            {strategy.isPrivate ? (
                                <Icon size='lg' as={UnlockIcon} />
                            ) : (
                                <Icon size='lg' as={LockIcon} />
                            )}
                        </HStack>
                        <Text>@{strategy.createdByUser?.username}</Text>
                    </Stack>
                    <Box flexGrow={1} />
                    <Menu>
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
                    </Menu>
                </HStack>
                <Tabs index={index} onChange={handleTabsChange}>
                    <TabList>
                        <Tab>Stats</Tab>
                        <Tab>SourceCode</Tab>
                        <Tab>Battles</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <StrategyStatTab strategy={strategy} />
                        </TabPanel>
                        <TabPanel>
                            <StrategySourceCodeTab strategy={strategy} />
                        </TabPanel>
                        <TabPanel>
                            {/* <StrategyBattleTab strategy={strategy} /> */}
                            <ProfileBattlesTab strategyId={strategy.id} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
            {/* <Center>
                <ButtonGroup>
                    <Button size='md' mt='20px' type='submit' isLoading={isLoading}>
                        Search Strategy
                    </Button>
                    <Button
                        colorScheme='red'
                        size='md'
                        mt='20px'
                        onClick={() => navigate(`/Profile/${id}`)}
                    >
                        Back To Profile
                    </Button>
                </ButtonGroup>
            </Center> */}
        </Box>
    )
}

export default StrategyPage
