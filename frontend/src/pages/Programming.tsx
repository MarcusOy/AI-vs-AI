import React, { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import {
    Flex,
    Spacer,
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    ButtonGroup,
    Center,
    Image,
    Divider,
    Grid,
    GridItem,
    Heading,
    HStack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    VStack,
    IconButton,
    Tag,
    TagCloseButton,
    TagLabel,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAVAFetch from '../helpers/useAVAFetch'
import {
    devComplete,
    developerAi,
    easyAi,
    emptyStarter,
    helperFunctions,
} from '../helpers/hardcodeAi'
import CodeModal from './CodeModal'
import IdentityService from '../data/IdentityService'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import EditDraftName from '../components/EditDraftName'
import { Strategy } from '../models/strategy'
import { AVAStore } from '../data/DataStore'
import { Battle } from '../models/battle'
import { StrategyStatus } from '../models/strategy-status'
function Programming() {
    const navigate = useNavigate()
    const [tabIndex, setTabIndex] = useState(0)

    const handleShowSubmission = () => {
      setTabIndex(3)
    }
  
    const handleTabsChange = (index) => {
      setTabIndex(index)
    }
    const [connection, setConnection] = useState<HubConnection | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [code, setCode] = useState(helperFunctions + devComplete)
    const [select, setSelect] = useState(false)
    const [buffer, setBuffer] = useState(0)
    const [name, setName] = useState('')
    const [emptyClipboard, setEmptyClipboard] = useState(false)
    const [copied, setCopied] = useState(false)
    const [submissions, setSubmissions] = useState<Battle[]>([])
    const { id } = useParams()
    const { whoAmI } = AVAStore.useState()

    useEffect(() => {
        const signalRConnection = new HubConnectionBuilder()
            // @ts-ignore
            .withUrl(process.env.REACT_APP_API_ENDPOINT + 'AI')
            .withAutomaticReconnect()
            .build()
        setConnection(signalRConnection)
    }, [])
    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    console.log('Connected.')
                    connection!.on('TestSubmissionResult', (response) => {
                        const battle = response.resultingBattle as Battle
                        console.log('TestSubmissionResult Response:', battle)
                        // @ts-ignore
                        setSubmissions((past) => [...past, battle])
                        handleShowSubmission()
                    })
                })
                .catch((e) => console.log('Connection failed: ', e))
        }
    }, [connection])
    const load = useAVAFetch('/getAi/' + id)
    let strategy = load.data
    const data = useAVAFetch(id === undefined ? '/Games/1' : '/Games/1').data
    const { isLoading, error, execute } = useAVAFetch(
        '/Strategy/Update',
        { method: 'PUT' },
        { manual: true },
    )
    const submit = useAVAFetch('/Strategy/Submit', { method: 'PUT' }, { manual: true }).execute
    const run = useAVAFetch('/Strategy/TestStrategy/', { method: 'POST' }, { manual: true }).execute
    // const run = useAVAFetch('/Strategy/TestPublish', { method: 'POST' }, { manual: true }).execute
    useEffect(() => {
        if (strategy !== undefined) {
            if (editorRef !== null && editorRef.current !== null) {
                // @ts-ignore
                editorRef.current.setValue(strategy === undefined ? code : strategy.sourceCode)
            }
            setName(strategy.name)
            setCode(strategy === undefined ? code : strategy.sourceCode)
        }
    }, [strategy])
    useEffect(() => {
        if (!load.isLoading && strategy === undefined) {
            navigate('/Programming/')
        }
    }, [load.isLoading])
    const editorRef = useRef(null)

    function handleEditorDidMount(editor, monaco) {
        editor.setHiddenAreas([new monaco.Range(1, 0, 490, 0)])
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
    const submitStrategy = async () => {
        const build: Strategy = {
            name: name,
            sourceCode: code,
            createdByUserId: strategy.createdByUserId,
            id: strategy.id,
        }
        strategy.status = 1
        await submit({ data: build })
        IdentityService.refreshIdentity()
    }
    const runStrategy = async () => {
        const data = {
            strategyToTest: {
                name: name,
                sourceCode: code,
                createdByUserId: strategy.createdByUserId,
                id: strategy.id,
                strategy: StrategyStatus.Draft,
            },
            stock: -1,
            clientId: connection?.connectionId,
        }
        strategy = await execute({ data: data.strategyToTest })
        strategy.status = 1
        if (select) {
            console.log(await run({ data }))
        }
        setSelect(!select)
    }

    return (
        <Box pt='0'>
            <Flex>
                <Heading>
                    {strategy === undefined ? (
                        'Loading Strategy...'
                    ) : (
                        <EditDraftName name={name} setName={setName.bind(this)} />
                    )}
                </Heading>
                <Spacer />
                <Heading>
                    {strategy === undefined
                        ? ''
                        : 'Status: ' + (strategy.status === 0 ? 'Draft' : 'Active')}
                </Heading>
                <Spacer />
                {!copied && (
                    <Button
                        onClick={() => {
                            sessionStorage.setItem('clipboard', editorRef.current.getValue())
                            setCopied(true)
                        }}
                    >
                        Copy
                    </Button>
                )}
                {copied && (
                    <Tag size={'lg'} borderRadius='full' variant='solid' colorScheme='green' mx='2'>
                        <TagLabel>Copied!</TagLabel>
                        <TagCloseButton onClick={() => setCopied(false)} />
                    </Tag>
                )}
                {!emptyClipboard && (
                    <Button
                        mx='2'
                        display={'flex'}
                        justifyContent='flex-end'
                        onClick={() => {
                            sessionStorage.getItem('clipboard') !== null
                                ? editorRef.current.setValue(sessionStorage.getItem('clipboard'))
                                : setEmptyClipboard(true)
                        }}
                    >
                        Paste
                    </Button>
                )}
                {emptyClipboard && (
                    <Tag size={'lg'} borderRadius='full' variant='solid' colorScheme='red' mx='2'>
                        <TagLabel>Cannot Paste Empty Clipboard</TagLabel>
                        <TagCloseButton onClick={() => setEmptyClipboard(false)} />
                    </Tag>
                )}
                <Button
                    display={'flex'}
                    justifyContent='flex-end'
                    onClick={() => {
                        editorRef.current.setHiddenAreas([new monaco.Range(1, 0, 490, 0)])
                    }}
                >
                    Hide Helper
                </Button>
            </Flex>
            <HStack>
                <Box width='45%' borderRadius='1g' borderWidth='1px'>
                    <Tabs variant='enclosed' onChange={handleTabsChange}>
                        <TabList>
                            <Tab>Game Canvas</Tab>
                            <Tab>Game Description</Tab>
                            <Tab>Documentation</Tab>
                            <Tab>Submission Statistics</Tab>
                        </TabList>
                        <TabPanels height='72vh'>
                            <TabPanel>
                                {data !== undefined && strategy !== undefined && (
                                    <Image src='/Finished_Board.png' alt='logo' />
                                )}
                            </TabPanel>
                            <TabPanel>
                                <Center>
                                    <Heading margin='3'>
                                        {data === undefined || strategy === undefined
                                            ? 'Game Name'
                                            : data.name}
                                    </Heading>
                                </Center>
                                <p>
                                    {data === undefined || strategy === undefined
                                        ? 'Game Description'
                                        : data.longDescription}
                                </p>
                            </TabPanel>
                            <TabPanel>
                                {strategy !== undefined && (
                                    <HStack justifyContent={'center'} gap='2'>
                                        <h1>View Complete Developer Code</h1>
                                        <CodeModal
                                            strategy={{
                                                name: 'Developer Ai',
                                                gameId: 1,
                                                sourceCode: devComplete,
                                            }}
                                        />
                                    </HStack>
                                )}
                                {strategy !== undefined && (
                                    <HStack m='2' justifyContent={'center'} gap='2'>
                                        <h1>View Incomplete Starter Code</h1>
                                        <CodeModal
                                            strategy={{
                                                name: 'Initial Ai with Comments',
                                                gameId: 1,
                                                sourceCode: emptyStarter,
                                            }}
                                        />
                                    </HStack>
                                )}
                                <Center>
                                    <a
                                        href='https://docs.google.com/document/d/1gTAEE-0M2rklHGBfeS9CtV1GIerUqjE-Yyp2TkZ8RTU/edit#heading=h.hp2c6iz21hyn'
                                        target='_blank'
                                        rel='noreferrer'
                                    >
                                        <Button>Link to Documentation</Button>
                                    </a>
                                </Center>
                            </TabPanel>
                            <TabPanel>
                                <Accordion allowToggle>
                                    {submissions.map((value, key) => {
                                        return (
                                            <AccordionItem key={key}>
                                                <h2>
                                                    <AccordionButton>
                                                        <Box flex='1' textAlign='left' color={value.attackerWins === 1 ? 'green' : 'red'}>
                                                            Submission #{key + 1}
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    <VStack>
                                                        <Box>
                                                            {value.name}
                                                        </Box>
                                                        <Box>
                                                            {value.attackerWins === 1 ? 'You Win!' : 'Iterate and Improve, You Lost...'}
                                                        </Box>
                                                        <Box>
                                                            Turns: {value.battleGames[0].turns.length}
                                                        </Box>
                                                    </VStack></AccordionPanel>
                                            </AccordionItem>
                                        )
                                    })}
                                </Accordion>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
                <Box width='55%' height='75vh'>
                    <Editor
                        defaultLanguage='javascript'
                        defaultValue={code}
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
                            strategy={{ name: 'Easy Stock Code', gameId: 1, sourceCode: easyAi }}
                            color={select ? 'white' : 'green'}
                        />
                    </ButtonGroup>
                    <ButtonGroup isAttached variant='outline' margin='4' isDisabled>
                        <Button color={'orange'}>Medium Stock</Button>
                        <CodeModal
                            strategy={{ name: 'Easy Stock Code', gameId: 1, sourceCode: easyAi }}
                            color={'orange'}
                        />
                    </ButtonGroup>
                    <ButtonGroup variant='outline' margin='3' isDisabled isAttached>
                        <Button color={'red'} disabled>
                            Hard Stock
                        </Button>
                        <CodeModal
                            strategy={{ name: 'Easy Stock Code', gameId: 1, sourceCode: easyAi }}
                            color={'red'}
                        />
                    </ButtonGroup>
                </GridItem>
                <GridItem colStart={9}>
                    <Button
                        margin='3'
                        disabled={!select}
                        onClick={() => (strategy.status === 0 ? runStrategy() : onOpen())}
                        isLoading={isLoading}
                    >
                        Run Strategy
                    </Button>
                    <Button
                        margin='3'
                        disabled={!select || strategy.status === 1}
                        onClick={() => submitStrategy()}
                    >
                        Submit Strategy
                    </Button>
                </GridItem>
            </Grid>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Your draft is currently Active, continuing will place it back in Draft
                        status.
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            variant='ghost'
                            onClick={() => {
                                onClose()
                                runStrategy()
                            }}
                        >
                            Continue
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
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
