import React from 'react'
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
} from '@chakra-ui/react'
import { randomColor } from '@chakra-ui/theme-tools'
import StrategyStatTab from './StrategyStatTab'
import StrategyBattleTab from './StrategyBattleTab'
import StrategySourceCodeTab from './StrategySourceCodeTab'
import useAVAFetch from '../../helpers/useAVAFetch'
import { WarningIcon } from '@chakra-ui/icons'
import EditFullName from '../../components/profile/EditFullName'
import { Strategy } from '../../models/strategy'
import { AVAStore } from '../../data/DataStore'
import { TbBook2 } from 'react-icons/tb'

const StrategyPage = () => {
    const { whoAmI } = AVAStore.useState()
    const navigate = useNavigate()
    const { id, tab } = useParams()
    const { data, isLoading, error } = useAVAFetch(`/Strategy/${id}`)
    const strategy: Strategy = data
    // const isSelf = strategy.createdByUserId == whoAmI?.id

    const index = tab == 'Stats' ? 0 : tab == 'SourceCode' ? 1 : tab == 'Battles' ? 2 : -1

    const handleTabsChange = (index) => {
        const tab = index == 1 ? 'SourceCode' : index == 2 ? 'Battles' : 'Stats'
        navigate(`/Strategy/${id}/${tab}`)
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
                        size='xl'
                        bg={randomColor({ string: strategy.name })}
                        icon={<TbBook2 size='25' />}
                    />
                    <Stack spacing='0'>
                        {/* {isSelf ? <EditFullName /> : <Heading>{strategy.name}</Heading>} */}

                        <Text fontSize='lg' mt={0}>
                            @{strategy.createdByUser?.username}
                        </Text>
                    </Stack>
                </HStack>
                <Tabs index={index} onChange={handleTabsChange}>
                    <TabList>
                        <Tab>Stats</Tab>
                        <Tab>SourceCode</Tab>
                        <Tab>Battles</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <StrategyStatTab />
                        </TabPanel>
                        <TabPanel>
                            <StrategySourceCodeTab />
                        </TabPanel>
                        <TabPanel>
                            <StrategyBattleTab />
                            <Text>Battles</Text>
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
