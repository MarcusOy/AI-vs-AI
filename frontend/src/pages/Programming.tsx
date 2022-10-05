import React, { useRef, useState } from 'react'
import Editor from '@monaco-editor/react';
import { Box, Button, Center, Code, Divider, Grid, GridItem, Heading, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { useParams } from 'react-router-dom';
import useAVAFetch from '../helpers/useAVAFetch'

function Programming() {
  const initialValue = '// Enter Strategy Here'
  const [code, setCode] = useState(initialValue);
  const [select, setSelect] = useState(false);
  const [buffer, setBuffer] = useState(0);
  const { id } = useParams();
  const { data } = useAVAFetch(id === undefined ? '/Games/1' : '/Games/');
  console.log(data);

  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    console.log('Stored instance')
    editorRef.current = editor;
  }
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
                  Game Description
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
                  <Center>
                    <Heading margin='3'>{data === undefined ? 'Game Name': data.name}</Heading>
                  </Center>
                  <p>{data === undefined ? 'Game Description': data.longDescription}</p>
                </TabPanel>
                <TabPanel>
                  <VStack justifyContent={'center'}>
                    <Code>
                      {data === undefined ? 'Game Boilerplate': data.boilerplateCode}
                    </Code>
                    <Button rightIcon={<ArrowForwardIcon />} onClick={() => {
                      if (editorRef !== null) {
                        editorRef.current.setValue(data === undefined ? 'Game Boilerplate' : data.boilerplateCode)
                      }
                      }
                    }>
                      Move to Editor
                    </Button>
                  </VStack>
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
            onMount={handleEditorDidMount}
            />
          </Box>
      </HStack>
      <Divider orientation='horizontal'/>
      <Grid>
        <GridItem>
            <Button variant='outline' margin='3' color={select ? 'white' : 'green'} background={select ? 'green': ''} onClick={() => setSelect(!select)}>
            Easy Stock
          </Button>
          <Button variant='outline' margin='3' color={'orange'} disabled>
            Medium Stock
          </Button>
          <Button variant='outline' margin='3' color={'red'} disabled>
            Hard Stock
          </Button>
        </GridItem>
        <GridItem colStart={9}>
          <Button margin='3'>
            Run Strategy
          </Button>
          <Button margin='3' disabled>
            Submit Strategy
          </Button>
        </GridItem>
      </Grid> 
    </Box>
      )
}
export default Programming