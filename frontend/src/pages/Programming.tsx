import React, { useState } from 'react'
import Editor from '@monaco-editor/react';
import { Box, Button, Divider, HStack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
function Programming() {
    const initialValue = '// Enter Strategy Here'
    const [code, setCode] = useState(initialValue);
    return (
        <Box>
          <HStack>
            <Box width='45%' borderRadius='1g' borderWidth='1px'>
              <Tabs variant='enclosed'>
                  <TabList>
                    <Tab>
                      Game Canvas
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel height='82vh'>
                      <img src='/10x10 chess board.png' className='App-logo' alt='logo'/>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
              <Box width='55%' height='85vh'>
                <Editor
                defaultLanguage="javascript"
                defaultValue={initialValue}
                theme='vs-dark'
                onChange={(value) => setCode(value === undefined ? '' : value)}
                />
              </Box>
        </HStack>
        <Divider orientation='horizontal'/>
        <Box  mx='3' borderRadius='1g' borderWidth='1px' width='98%' display='flex' flexDirection='row' justifyContent='flex-end'>
          <Button margin='3'>
            Run Strategy
          </Button>
        </Box>
      </Box>
      )
}
export default Programming