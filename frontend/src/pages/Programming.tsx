import React, { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, ButtonGroup, Center, Image, Divider, Grid, GridItem, Heading, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { useParams } from 'react-router-dom'
import useAVAFetch from '../helpers/useAVAFetch'
import { developerAi, easyAi, helperFunctions } from '../helpers/hardcodeAi'
import CodeModal from './CodeModal'
import IdentityService from '../data/IdentityService';

function Programming() {
    const [code, setCode] = useState('')
    const [select, setSelect] = useState(false)
    const [buffer, setBuffer] = useState(0)
    const { id } = useParams()
    const strategy = useAVAFetch('/getAi/' + id).data
    console.log(strategy)
    const data = useAVAFetch(id === undefined ? '/Games/1' : '/Games/1').data
    const { isLoading, error, execute } = useAVAFetch(
        '/Strategy',
        { method: 'POST' },
        { manual: true },
    )
    useEffect(() => {
        if (editorRef !== null && editorRef.current !== null) {
            // @ts-ignore
           /* editorRef.current.setValue(
                data === undefined ? 'Game Boilerplate' : data.boilerplateCode,
            ) */
        }
        setCode(data === undefined ? '// Enter Strategy Here' : data.boilerplateCode)
    }, [data])
    console.log(data)

    const editorRef = useRef(null)

    function handleEditorDidMount(editor, monaco) {
        console.log('Stored instance')
        editor.setHiddenAreas([new monaco.Range(1,0,932,0)]);
        editorRef.current = editor
    }
    const updateSave = (value) => {
        setCode(value === undefined ? '' : value)
        if (buffer + 1 > 10) {
            localStorage.setItem('draft', code)
            localStorage.setItem('draftAvailable', 'true')
            setBuffer(0)
        } else {
            setBuffer(buffer + 1)
        }
    }
    const runStrategy = async () => {
        await execute({ data: strategy })
        IdentityService.refreshIdentity()
        
    }
    return (
        <Box>
            <HStack>
                <Box width='45%' borderRadius='1g' borderWidth='1px'>
                    <Tabs variant='enclosed'>
                        <TabList>
                            <Tab>Game Canvas</Tab>
                            <Tab>Game Description</Tab>
                            <Tab>Documentation</Tab>
                            <Tab>Submission Statistics</Tab>
                        </TabList>
                        <TabPanels height='75vh'>
                            <TabPanel>
                                <Image src='/chessboard.png' alt='logo' />
                            </TabPanel>
                            <TabPanel>
                                <Center>
                                    <Heading margin='3'>
                                        {data === undefined || strategy === undefined ? 'Game Name' : data.name}
                                    </Heading>
                                </Center>
                                <p>
                                    {data === undefined || strategy === undefined ? 'Game Description' : data.longDescription}
                                </p>
                            </TabPanel>
                            <TabPanel>
                                {strategy !== undefined && <HStack justifyContent={'center'} gap='2'>
                                    <h1>View Complete Developer Code</h1>
                                    <CodeModal codeName='Developer Ai' code={helperFunctions} />
                                </HStack>
                                }
                            </TabPanel>
                            <TabPanel>
                                <Accordion allowToggle>
                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton>
                                                <Box flex='1' textAlign='left'>
                                                                            Past Submission
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
                <Box width='55%' height='77vh'>
                    <Editor
                        defaultLanguage='typescript'
                        defaultValue={
                            localStorage.getItem('draftAvailable') === 'true'
                                ? localStorage.getItem('draft') || helperFunctions
                                : helperFunctions
                        }
                        theme='vs-dark'
                        onChange={(value) => updateSave(value)}
                        onMount={handleEditorDidMount}
                    />
                </Box>
            </HStack>
            <Divider orientation='horizontal' />
            <Grid>
                <GridItem>
                    <ButtonGroup
                        isAttached
                        variant='outline'
                        margin='4'
                        color={select ? 'white' : 'green'}
                        background={select ? 'green' : ''}
                        isDisabled={strategy === undefined}
                    >
                        <Button
                            variant='outline'
                            color={select ? 'white' : 'green'}
                            background={select ? 'green' : ''}
                            onClick={() => setSelect(!select)}
                        >
                            Easy Stock
                        </Button>
                        <CodeModal
                            codeName='Easy Stock Code'
                            code={easyAi}
                            color={select ? 'white' : 'green'}
                        />
                    </ButtonGroup>
                    <ButtonGroup isAttached variant='outline' margin='4' isDisabled>
                        <Button color={'orange'}>Medium Stock</Button>
                        <CodeModal code='' color={'orange'} />
                    </ButtonGroup>
                    <ButtonGroup variant='outline' margin='3' isDisabled isAttached>
                        <Button color={'red'} disabled>
                            Hard Stock
                        </Button>
                        <CodeModal code='' color={'red'} />
                    </ButtonGroup>
                </GridItem>
                <GridItem colStart={9}>
                    <Button margin='3' disabled={!select} onClick={() => runStrategy()} isLoading={isLoading}>
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
