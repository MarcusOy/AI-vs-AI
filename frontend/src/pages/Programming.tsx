import React, { useState } from 'react'
import Editor from '@monaco-editor/react';
import { Box, Button, Divider, HStack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
function Programming() {
    const initialValue = '// Enter Strategy Here'
    const [code, setCode] = useState(initialValue);
    const [buffer, setBuffer] = useState(0);

    const updateSave = (value) => {
      setCode(value === undefined ? '' : value)
      if (buffer + 1 > 10) {
        localStorage.setItem('draft', code);
        localStorage.setItem('draftAvailable', 'true');
        setBuffer(0);
      } else {
        setBuffer(buffer+1)
      }
    }

    return (
        <Box>
          <HStack>
            <Box width='45%' borderRadius='1g' borderWidth='1px'>
              <Tabs variant='enclosed'>
                  <TabList>
                    <Tab>
                      Game Canvas
                    </Tab>
                    <Tab>
                      Stock Code
                    </Tab>
                    <Tab>
                      Submission Statistics
                    </Tab>
                  </TabList>
                  <TabPanels height='82vh'>
                    <TabPanel>
                      <img src='/10x10 chess board.png' className='App-logo' alt='logo'/>
                    </TabPanel>
                    <TabPanel>

                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
              <Box width='55%' height='85vh'>
                <Editor
                defaultLanguage="javascript"
                defaultValue={localStorage.getItem('draftAvailable') === 'true' ? localStorage.getItem('draft') || initialValue : initialValue}
                theme='vs-dark'
                onChange={(value) => updateSave(value)}
                />
              </Box>
        </HStack>
        <Divider orientation='horizontal'/>
        <Box  mx='3' borderRadius='1g' borderWidth='1px' width='98%' display='flex' flexDirection='row' justifyContent='flex-end'>
          <Button margin='3'>
            Run Strategy
          </Button>
          <Button margin='3' disabled>
            Submit Strategy
          </Button>
        </Box>
      </Box>
      )
}
export default Programming