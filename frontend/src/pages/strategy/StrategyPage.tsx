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
    Tooltip,
    Badge,
    useDisclosure,
} from '@chakra-ui/react'
import { randomColor } from '@chakra-ui/theme-tools'
import StrategyStatTab from './StrategyStatTab'
import StrategySourceCodeTab from './StrategySourceCodeTab'
import useAVAFetch from '../../helpers/useAVAFetch'
import { ChevronDownIcon, WarningIcon } from '@chakra-ui/icons'
import { Strategy } from '../../models/strategy'
import { AVAStore } from '../../data/DataStore'
import { TbBook2 } from 'react-icons/tb'
import { GoGlobe, GoLock } from 'react-icons/go'
import ProfileBattlesTab from '../profile/ProfileAndStratBattlesTab'
import { StrategyStatus } from '../../models/strategy-status'
import DuplicateModal from '../../components/modals/DuplicateModal'

const StrategyPage = () => {
    const { whoAmI } = AVAStore.useState()
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { id, tab } = useParams()
    const { data, isLoading, error, execute } = useAVAFetch(`/Strategy/${id}`)
    const strategy: Strategy = data
    const toast = useToast()

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
            await execute()
            toast({
                title: 'Code visibility changed successfully.',
                description: `You just changed this strategy's visibility to ${
                    !strategy.isPrivate ? 'private' : 'public'
                }.`,
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

    const isSelf = whoAmI?.id == strategy.createdByUserId

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
                        size='xl'
                        bg={randomColor({ string: strategy.name })}
                        icon={<TbBook2 size='50' />}
                    />
                    <Stack spacing='0'>
                        {/* {isSelf ? <EditFullName /> : <Heading>{strategy.name}</Heading>} */}
                        <HStack>
                            <Heading fontSize='4xl' mt={0}>
                                {strategy.name}
                            </Heading>
                            <Tooltip
                                label={strategy.isPrivate ? 'Private strategy' : 'Public strategy'}
                            >
                                <Box>
                                    {strategy.isPrivate ? (
                                        <GoLock size='25' />
                                    ) : (
                                        <GoGlobe size='25' />
                                    )}
                                </Box>
                            </Tooltip>
                        </HStack>
                        <Text>
                            <span style={{ marginRight: 10 }}>
                                @{strategy.createdByUser?.username}
                            </span>
                            {strategy.status == StrategyStatus.Draft && (
                                <Badge variant='outline' colorScheme='cyan'>
                                    Draft
                                </Badge>
                            )}
                            {strategy.status == StrategyStatus.Active && (
                                <Badge variant='solid' colorScheme='cyan'>
                                    Active
                                </Badge>
                            )}
                            {strategy.status == StrategyStatus.InActive && (
                                <Badge variant='subtle' colorScheme='cyan'>
                                    InActive
                                </Badge>
                            )}
                        </Text>
                    </Stack>
                    <Box flexGrow={1} />
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            Actions
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Attack</MenuItem>
                            <MenuItem>Manually Attack</MenuItem>
                            <MenuItem onClick={onOpen}>Duplicate</MenuItem>
                            <MenuItem onClick={() => {
                                sessionStorage.setItem('clipboard', strategy.sourceCode);
                                toast({
                                    title: 'Code copied successfully.',
                                    description: 'You just copied this strategy\'s source code to clipboard',
                                    status: 'success',
                                    duration: 5000,
                                    isClosable: true,
                                })
                            }}>Copy</MenuItem>
                            {/* <MenuItem>Mark as Draft</MenuItem> */}
                            {isSelf && (
                                <MenuItem onClick={onSubmit}>
                                    {strategy.isPrivate ? 'Set Public' : 'Set Private'}
                                </MenuItem>
                            )}
                        </MenuList>
                    </Menu>
                    <DuplicateModal isOpen={isOpen} strategy={strategy} onOpen={onOpen.bind(this)} onClose={onClose.bind(this)} />
                </HStack>
                <Tabs index={index} onChange={handleTabsChange}>
                    <TabList>
                        <Tab>Stats</Tab>
                        <Tab>Source Code</Tab>
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
