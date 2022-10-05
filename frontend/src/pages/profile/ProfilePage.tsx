import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Box,
    Stack,
    Avatar,
    Text,
    HStack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Spinner,
    Center,
    Link,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Heading,
} from '@chakra-ui/react'
import { AVAStore } from '../../data/DataStore'
import useAVAFetch from '../../helpers/useAVAFetch'
import EditFullName from '../../components/profile/EditFullName'
import ProfileViewTab from './ProfileViewTab'
import { User } from '../../models/user'
import ProfileStrategiesTab from './ProfileStrategiesTab'
import ProfileBattlesTab from './ProfileBattlesTab'
import ProfileSubmissionsTab from './ProfileSubmissionsTab'
import { WarningIcon } from '@chakra-ui/icons'

const ProfilePage = () => {
    const { whoAmI } = AVAStore.useState()
    const { id, tab } = useParams()
    const navigate = useNavigate()

    const isSelf = id == whoAmI?.id
    const { data, error, isLoading } = useAVAFetch(
        `/Account/${id}`,
        {},
        { manual: isSelf }, // don't retrieve account if self
    )
    const user: User = isSelf ? whoAmI : data

    const index =
        tab == 'View'
            ? 0
            : tab == 'Strategies'
            ? 1
            : tab == 'Battles'
            ? 2
            : tab == 'Submissions'
            ? 3
            : -1

    const handleTabsChange = (index) => {
        const tab =
            index == 1 ? 'Strategies' : index == 2 ? 'Battles' : index == 3 ? 'Submissions' : 'View'
        navigate(`/Profile/${id}/${tab}`)
    }

    if (isLoading)
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
                        <Text fontSize='5xl'>User not found</Text>
                        <Text fontSize='lg'>The user you are looking for was not found.</Text>
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

    const fullName = `${user.firstName} ${user.lastName}`

    return (
        <Box mx='100'>
            <HStack>
                <Avatar size='xl' name={fullName} />
                <Stack spacing='0'>
                    {isSelf ? <EditFullName /> : <Heading>{fullName}</Heading>}

                    <Text fontSize='lg' mt={0}>
                        @{user.username}
                    </Text>
                </Stack>
            </HStack>
            <Tabs index={index} onChange={handleTabsChange}>
                <TabList>
                    <Tab>Profile</Tab>
                    <Tab>Strategies</Tab>
                    <Tab>Battles</Tab>
                    <Tab>Submissions</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <ProfileViewTab user={user} isSelf={isSelf} />
                    </TabPanel>
                    <TabPanel>
                        <ProfileStrategiesTab />
                    </TabPanel>
                    <TabPanel>
                        <ProfileBattlesTab />
                    </TabPanel>
                    <TabPanel>
                        <ProfileSubmissionsTab />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

export default ProfilePage
