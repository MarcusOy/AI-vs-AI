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
import GameboardViewer from '../components/GameboardViewer'
import { useNavigate, useParams } from 'react-router-dom'
import useAVAFetch from '../helpers/useAVAFetch'
import {
    devComplete,
    easyAi,
    emptyStarter,
    hardAi,
    helperFunctions,
    mediumAi,
} from '../helpers/hardcodeAi'
import CodeModal from './CodeModal'
import IdentityService from '../data/IdentityService'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import EditDraftName from '../components/EditDraftName'
import { Strategy } from '../models/strategy'
import { AVAStore } from '../data/DataStore'
import { Battle } from '../models/battle'
import { StrategyStatus } from '../models/strategy-status'
import { initialState } from '../data/ChessBoard'
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
    const [medium, setMedium] = useState(false)
    const [hard, setHard] = useState(false)
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
                        setSubmissions((past) => [battle, ...past])
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
    const toggleStock = (value) => {
        switch (value) {
            case 1:
                setSelect(true)
                setMedium(false)
                setHard(false)
                break
            case 2:
                setSelect(false)
                setMedium(true)
                setHard(false)
                break
            case 3:
                setSelect(false)
                setMedium(false)
                setHard(true)
                break
            default:
                setSelect(false)
                setMedium(false)
                setHard(false)
        }
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
        let chosen
        if (select) {
            chosen = -1
        } else if (medium) {
            chosen = -2
        } else {
            chosen = -3
        }
        const data = {
            strategyToTest: {
                name: name,
                sourceCode: code,
                createdByUserId: strategy.createdByUserId,
                id: strategy.id,
                strategy: StrategyStatus.Draft,
            },
            stock: chosen,
            clientId: connection?.connectionId,
        }
        strategy = await execute({ data: data.strategyToTest })
        strategy.status = 0
        if (select || hard || medium) {
            console.log(await run({ data }))
        }
        toggleStock(0)
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
                                    <GameboardViewer
                                        size={500}
                                        type='Non-interactive'
                                        board={initialState}
                                    />
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
                                                        <Box
                                                            flex='1'
                                                            textAlign='left'
                                                            color={
                                                                value.attackerWins === 1
                                                                    ? 'green'
                                                                    : 'red'
                                                            }
                                                        >
                                                            Submission #{submissions.length - key}
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    <VStack>
                                                        <Box>{value.name}</Box>
                                                        <Box>
                                                            {value.attackerWins === 1
                                                                ? 'You Win!'
                                                                : 'Iterate and Improve, You Lost...'}
                                                        </Box>
                                                        <Box>
                                                            Turns:{' '}
                                                            {value.battleGames[0].turns.length}
                                                        </Box>
                                                    </VStack>
                                                </AccordionPanel>
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
                            onClick={() => toggleStock(1)}
                        >
                            Easy Stock
                        </Button>
                        <CodeModal
                            strategy={{ name: 'Easy Stock Code', gameId: 1, sourceCode: easyAi }}
                            color={select ? 'white' : 'green'}
                        />
                    </ButtonGroup>
                    <ButtonGroup
                        isAttached
                        variant='outline'
                        margin='4'
                        color={medium ? 'white' : 'orange'}
                        background={medium ? 'orange' : ''}
                    >
                        <Button color={medium ? 'white' : 'orange'} onClick={() => toggleStock(2)}>
                            Medium Stock
                        </Button>
                        <CodeModal strategy={mediumAi} color={medium ? 'white' : 'orange'} />
                    </ButtonGroup>
                    <ButtonGroup
                        variant='outline'
                        margin='3'
                        isAttached
                        color={hard ? 'white' : 'red'}
                        background={hard ? 'red' : ''}
                    >
                        <Button color={hard ? 'white' : 'red'} onClick={() => toggleStock(3)}>
                            Hard Stock
                        </Button>
                        <CodeModal strategy={hardAi} color={hard ? 'white' : 'red'} />
                    </ButtonGroup>
                </GridItem>
                <GridItem colStart={9}>
                    <Button
                        margin='3'
                        disabled={(!select && !hard && !medium) || isLoading}
                        onClick={() => (strategy.status === 0 ? runStrategy() : onOpen())}
                        isLoading={isLoading}
                    >
                        Run Strategy
                    </Button>
                    <Button
                        margin='3'
                        disabled={strategy === undefined || strategy.status === 1}
                        onClick={() => submitStrategy()}
                    >
                        Activate Strategy
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
