import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
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
            <p>login here!</p>
            <div>
                <LoginTab/>
            </div>
          </TabPanel>
          <TabPanel>
            <p>sign up here!</p>
            <div>
                <SignUpTab/>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    )
}

export default LoginSignUpPage
