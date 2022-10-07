import React, { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react';
import { Flex, Spacer, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, ButtonGroup, Center, Image, Divider, Grid, GridItem, Heading, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, VStack, IconButton } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Link, useParams } from 'react-router-dom'
import useAVAFetch from '../helpers/useAVAFetch'
import { devComplete, developerAi, easyAi, helperFunctions } from '../helpers/hardcodeAi'
import CodeModal from './CodeModal'
import IdentityService from '../data/IdentityService';
import EditDraftName from '../components/EditDraftName';
import { Strategy } from '../models/strategy';
import { AVAStore } from '../data/DataStore'

function Programming() {
    const [code, setCode] = useState(helperFunctions + devComplete)
    const [select, setSelect] = useState(false)
    const [buffer, setBuffer] = useState(0)
    const [name, setName] = useState('')
    const [submissions, setSubmissions] = useState([]);
    const { id } = useParams()
    const { whoAmI } = AVAStore.useState()
    console.log(whoAmI)
    let strategy;
    if (whoAmI !== undefined && whoAmI.strategies.length > 0) {
        whoAmI.strategies.forEach((strat, index) => {
            if (strat.id === id) {
                strategy = strat
            } else if (index === whoAmI.strategies.length - 1) {
                strategy = useAVAFetch('/getAi/' + id).data
            }
            })
    } else {
        strategy = useAVAFetch('/getAi/' + id).data
    }
    const data = useAVAFetch(id === undefined ? '/Games/1' : '/Games/1').data
    const { isLoading, error, execute } = useAVAFetch(
        '/Strategy/Update',
        { method: 'PUT' },
        { manual: true },
    )
    const run = useAVAFetch(
        '/Strategy/TestPublish',
        { method: 'POST'},
        { manual: true },
    ).execute
    useEffect(() => {
        if (editorRef !== null && editorRef.current !== null) {
            // @ts-ignore
            editorRef.current.setValue(
                strategy === undefined ? code : strategy.sourceCode,
            )
        }
        setCode(strategy === undefined ? code : strategy.sourceCode)
    }, [strategy])
    useEffect(() => {
        if (strategy !== undefined) {
           setName(strategy.name)
        }
    }, [strategy])

    const editorRef = useRef(null)

    function handleEditorDidMount(editor, monaco) {
        editor.setHiddenAreas([new monaco.Range(1,0,490,0)]);
        editorRef.current = editor
    }
    const updateSave = (value) => {
        setCode(value === undefined ? '' : value)
        if (buffer + 1 > 5) {
            localStorage.setItem(strategy?.id, code)
            setBuffer(0)
        } else {
            setBuffer(buffer + 1)
        }
    }
    const runStrategy = async () => {
        const build: Strategy = {
            name: name,
            sourceCode: code,
            createdByUserId: strategy.createdByUserId,
            id: strategy.id
        }
        strategy = await execute({ data: build })
        console.log(await run({ data: build }))
        // @ts-ignore
        setSubmissions((past) => [...past, '1'])
        setSelect(!select)
        // IdentityService.refreshIdentity()
    }

    return (
        <Box pt='0'>
            <Flex>
                <Heading>{strategy === undefined ? 'Invalid Strategy ID' : <EditDraftName name={name} setName={setName.bind(this)} />}</Heading>
                <Spacer/>
                <Button display={'flex'} justifyContent='flex-end' onClick={() => { editorRef.current.setHiddenAreas([new monaco.Range(1, 0, 932, 0)]); }}>Hide Helper</Button>
                </Flex>
            <HStack>
                <Box width='45%' borderRadius='1g' borderWidth='1px'>
                    <Tabs variant='enclosed'>
                        <TabList>
                            <Tab>Game Canvas</Tab>
                            <Tab>Game Description</Tab>
                            <Tab>Documentation</Tab>
                            <Tab>Submission Statistics</Tab>
                        </TabList>
                        <TabPanels height='72vh'>
                            <TabPanel>
                                {data !== undefined && strategy !== undefined  && <Image src='/Finished_Board.png' alt='logo' />}
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
                                    <CodeModal codeName='Developer Ai' code={devComplete} />
                                </HStack>
                                }
                                <Center>
                                    <a href="https://docs.google.com/document/d/1gTAEE-0M2rklHGBfeS9CtV1GIerUqjE-Yyp2TkZ8RTU/edit#heading=h.hp2c6iz21hyn" target="_blank" rel="noreferrer">
                                    <Button>
                                            Link to Documentation
                                    </Button>
                                    </a>
                                </Center>
                            </TabPanel>
                            <TabPanel>
                                <Accordion allowToggle>
                                    {submissions.map((value, key) => {
                                        return (<AccordionItem key={key}>
                                            <h2>
                                                <AccordionButton>
                                                    <Box flex='1' textAlign='left'>
                                                        Submission #{key+1}
                                                    </Box>
                                                    <AccordionIcon />
                                                </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4}>
                                                {value}
                                            </AccordionPanel>
                                        </AccordionItem>)
                                    })}
                                </Accordion>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
                <Box width='55%' height='75vh'>
                    <Editor
                        defaultLanguage='javascript'
                        defaultValue={
                            code
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
