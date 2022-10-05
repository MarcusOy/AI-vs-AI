import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Center, Box } from '@chakra-ui/react'
import SignUpTab from './SignUpTab'
import LoginTab from './LoginTab'
import { useNavigate, useParams } from 'react-router-dom'

const AuthPage = () => {
    const { tab } = useParams()
    const navigate = useNavigate()
    const tabIndex = tab == 'Signup' ? 1 : 0

    const handleTabsChange = (index) => {
        navigate('/Auth/' + (index == 1 ? 'Signup' : 'Login'))
    }

    return (
        <Center>
            <Box maxW='5xl'>
                <Tabs isFitted variant='enclosed' index={tabIndex} onChange={handleTabsChange}>
                    <TabList>
                        <Tab>Login</Tab>
                        <Tab>Signup</Tab>
                    </TabList>
                    <TabPanels shadow='md' borderWidth='1px' p={5}>
                        <TabPanel>
                            <Center>
                                <p>LOG IN</p>
                            </Center>
                            <Center>
                                <LoginTab />
                            </Center>
                        </TabPanel>
                        <TabPanel>
                            <Center>
                                <p>SIGN UP</p>
                            </Center>
                            <Center>
                                <SignUpTab />
                            </Center>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Center>
    )
}

export default AuthPage
