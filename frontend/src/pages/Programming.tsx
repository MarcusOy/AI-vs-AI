import React, { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, ButtonGroup, Center, Code, Divider, Grid, GridItem, Heading, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { useParams } from 'react-router-dom';
import useAVAFetch from '../helpers/useAVAFetch'
import { developerAi, easyAi } from '../helpers/hardcodeAi'
import CodeModal from './CodeModal'

function Programming() {
    const [code, setCode] = useState('');
    const [select, setSelect] = useState(false);
    const [buffer, setBuffer] = useState(0);
    const { id } = useParams();
    console.log(id)
    const { data } = useAVAFetch(id === undefined ? '/Games/1' : '/Games/1');
    useEffect(() => { if (editorRef !== null && editorRef.current !== null) {
        editorRef.current.setValue(data === undefined ? 'Game Boilerplate' : data.boilerplateCode);
    }
    setCode(data === undefined ? '// Enter Strategy Here': data.boilerplateCode)
    }, [data])
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
                  Developer Sample
                            </Tab>
                            <Tab>
                  Submission Statistics
                            </Tab>
                        </TabList>
                        <TabPanels height='75vh'>
                            <TabPanel>
                                <img src='chessboard.png' className='App-logo' alt='logo'/>
                            </TabPanel>
                            <TabPanel>
                                <Center>
                                    <Heading margin='3'>{data === undefined ? 'Game Name': data.name}</Heading>
                                </Center>
                                <p>{data === undefined ? 'Game Description': data.longDescription}</p>
                            </TabPanel>
                            <TabPanel>
                                <VStack justifyContent={'center'}>
                                    <h1>View Complete Developer Code</h1>
                                    <CodeModal codeName='Developer Ai' code={developerAi} />
                                </VStack>
                            </TabPanel>
                            <TabPanel>
                                <Accordion allowToggle>
                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton>
                                                <Box flex='1' textAlign='left'>
                            Submission 1
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
                <Box width='55%' height='77vh'>
                    <Editor
                        defaultLanguage="javascript"
                        defaultValue={localStorage.getItem('draftAvailable') === 'true' ? localStorage.getItem('draft') || code : code}
                        theme='vs-dark'
                        onChange={(value) => updateSave(value)}
                        onMount={handleEditorDidMount}
                    />
                </Box>
            </HStack>
            <Divider orientation='horizontal'/>
            <Grid>
                <GridItem>
                    <ButtonGroup isAttached variant='outline' margin='4' color={select ? 'white' : 'green'} background={select ? 'green': ''}>
                        <Button variant='outline' color={select ? 'white' : 'green'} background={select ? 'green': ''} onClick={() => setSelect(!select)}>
            Easy Stock
                        </Button>
                        <CodeModal codeName='Easy Stock Code' code={easyAi} color={select ? 'white' : 'green'} />
                    </ButtonGroup>
                    <ButtonGroup  isAttached variant='outline' margin='4'  isDisabled>
                        <Button color={'orange'}>
            Medium Stock
                        </Button>
                        <CodeModal code='' color={'orange'}/>
                    </ButtonGroup>
                    <ButtonGroup variant='outline' margin='3' isDisabled isAttached>
                        <Button color={'red'} disabled>
            Hard Stock
                        </Button>
                        <CodeModal code='' color={'red'}/>
                    </ButtonGroup>
                </GridItem>
                <GridItem colStart={9}>
                    <Button margin='3' disabled>
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
/*
                    <Button rightIcon={<ArrowForwardIcon />} onClick={() => {
                      if (editorRef !== null) {
                        editorRef.current.setValue(data === undefined ? 'Game Boilerplate' : data.boilerplateCode)
                      }
                      }
                    }>
                      Move to Editor
                    </Button>
                    */
export default Programming