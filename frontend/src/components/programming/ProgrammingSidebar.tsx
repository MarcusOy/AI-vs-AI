import { ArrowForwardIcon } from '@chakra-ui/icons'
import {
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
    Center,
    Heading,
    HStack,
    Button,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    VStack,
    Box,
    useTab,
    Tooltip,
    Badge,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spacer,
    Stack,
    Spinner,
    useDisclosure,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'
import { useMultiStyleConfig } from '@chakra-ui/system'
import React, { useState } from 'react'
import {
    BsJoystick,
    BsPlay,
    BsCodeSlash,
    BsListCheck,
    BsThermometerHalf,
    BsThermometerHigh,
    BsThermometerLow,
} from 'react-icons/bs'
import { IoFlask } from 'react-icons/io5'
import IdentityService from '../../data/IdentityService'
import useAVAFetch from '../../helpers/useAVAFetch'
import useAVASocket from '../../helpers/useAVASocket'
import { Battle } from '../../models/battle'
import { Game } from '../../models/game'
import { Strategy } from '../../models/strategy'
import { StrategyStatus } from '../../models/strategy-status'
import EditStrategyName from './EditStrategyName'

interface IProgrammingSidebarProps {
    strategy: Strategy
    onStrategyChange: () => void
}

const ProgrammingSidebar = (p: IProgrammingSidebarProps) => {
    const submitModal = useDisclosure()
    const testModal = useDisclosure()

    const [tabIndex, setTabIndex] = useState(0)
    const [submissions, setSubmissions] = useState<Battle[]>([])

    const onTestSubmissionResult = (response) => {
        const battle = response.resultingBattle as Battle
        console.log('TestSubmissionResult Response:', battle)
        // @ts-ignore
        setSubmissions((past) => [battle, ...past])
    }

    const onSubmitStrategy = async () => {
        await strategySubmit.execute()
        IdentityService.refreshIdentity()
    }

    const _ = useAVASocket([{ key: 'TestSubmissionResult', execute: onTestSubmissionResult }])
    const gameFetch = useAVAFetch('/Games/1') // TODO: dynamically change on strategy gameid
    const strategySubmit = useAVAFetch(
        `/Strategy/Submit/${p.strategy.id}`,
        { method: 'POST' },
        { manual: true },
    )
    const strategyRun = useAVAFetch('/Strategy/TestStrategy/', { method: 'POST' }, { manual: true })

    const game = gameFetch.data as Game

    const isLoading = gameFetch.isLoading || strategySubmit.isLoading || strategyRun.isLoading

    return (
        <Box h='100%'>
            <HStack p={3}>
                <EditStrategyName strategy={p.strategy} onNameChange={p.onStrategyChange} />
                <Stack justifyContent='center'>
                    {p.strategy.status == StrategyStatus.Draft && (
                        <Badge variant='outline' colorScheme='cyan'>
                            Draft
                        </Badge>
                    )}
                    {p.strategy.status == StrategyStatus.Active && (
                        <Badge variant='solid' colorScheme='cyan'>
                            Active
                        </Badge>
                    )}
                    {p.strategy.status == StrategyStatus.InActive && (
                        <Badge variant='subtle' colorScheme='cyan'>
                            Inactive
                        </Badge>
                    )}
                </Stack>
                <Spacer />
                {isLoading && <Spinner />}
                <Stack>
                    <HStack>
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                aria-label='Test strategy'
                                icon={<IoFlask />}
                                variant='outline'
                            />
                            <MenuList>
                                <MenuItem icon={<BsThermometerLow size={20} />}>
                                    Test against EasyAI
                                </MenuItem>
                                <MenuItem icon={<BsThermometerHalf size={20} />}>
                                    Test against MediumAI
                                </MenuItem>
                                <MenuItem icon={<BsThermometerHigh size={20} />}>
                                    Test against HardAI
                                </MenuItem>
                            </MenuList>
                        </Menu>
                        <Button
                            rightIcon={<ArrowForwardIcon />}
                            disabled={p.strategy.status == StrategyStatus.Active}
                            onClick={submitModal.onOpen}
                        >
                            Submit
                        </Button>
                    </HStack>
                </Stack>
            </HStack>
            <Tabs
                h='100%'
                borderTopWidth={1}
                borderTopColor='chakra-border-color'
                orientation='vertical'
                variant='enclosed'
                onChange={setTabIndex}
            >
                <TabList>
                    <Tooltip placement='right' label={'Game details'}>
                        <CustomTab>
                            <BsJoystick size={30} />
                        </CustomTab>
                    </Tooltip>
                    <Tooltip placement='right' label={'Testing'}>
                        <CustomTab>
                            <BsPlay size={30} />
                        </CustomTab>
                    </Tooltip>
                    <Tooltip placement='right' label={'Documentation'}>
                        <CustomTab>
                            <BsCodeSlash size={30} />
                        </CustomTab>
                    </Tooltip>
                    <Tooltip placement='right' label={'Submissions'}>
                        <CustomTab>
                            <BsListCheck size={30} />
                        </CustomTab>
                    </Tooltip>
                </TabList>
                <TabPanels borderLeftWidth={1} borderLeftColor='chakra-border-color' height='100%'>
                    <TabPanel>
                        <Stack height='100%' overflowY='scroll'>
                            <Center>
                                <Heading margin='3'>{game && game.name}</Heading>
                            </Center>

                            <p>{game && game.longDescription}</p>
                            <p>{game && game.longDescription}</p>
                            <p>{game && game.longDescription}</p>
                            <Box h='50' />
                        </Stack>
                    </TabPanel>
                    <TabPanel></TabPanel>
                    <TabPanel>
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
                                                        value.attackerWins === 1 ? 'green' : 'red'
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
                                                    Turns: {value.battleGames[0].turns.length}
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
            <Modal isOpen={submitModal.isOpen} onClose={submitModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        By submitting this strategy, you will matchmake with other strategies and be
                        unable to edit it&apos;s source code.
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={submitModal.onClose}>
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                submitModal.onClose()
                                // runStrategy()
                            }}
                        >
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

const CustomTab = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
    (props, ref) => {
        // @ts-ignore
        const tabProps = useTab({ ...props, ref })
        const isSelected = !!tabProps['aria-selected']

        const styles = useMultiStyleConfig('Tabs', tabProps)

        return (
            <Button
                __css={styles.tab}
                {...tabProps}
                // @ts-ignore
                color={!isSelected && 'chakra-border-color'}
                // @ts-ignore
                borderLeft={isSelected && styles.tab.borderBottom}
                borderBottom={0}
            >
                {tabProps.children}
            </Button>
        )
    },
)
CustomTab.displayName = 'SidebarTab'

export default ProgrammingSidebar
