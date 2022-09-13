import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Center } from '@chakra-ui/react'
import SignUpTab from './SignUpTab'
import LoginTab from './LoginTab'

const LoginSignUpPage = () => {
    return (
        <Tabs isFitted variant='enclosed'>
            <TabList mb='1em'>
                <Tab>Login</Tab>
                <Tab>Signup</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Center>
                        <p>LOG IN</p>
                    </Center>
                    <div>
                        <Center>
                            <LoginTab />
                        </Center>
                    </div>
                </TabPanel>
                <TabPanel>
                    <Center>
                        <p>SIGN UP</p>
                    </Center>
                    <div>
                        <Center>
                            <SignUpTab />
                        </Center>
                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default LoginSignUpPage
