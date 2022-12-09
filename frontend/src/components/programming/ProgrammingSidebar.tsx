import { ArrowForwardIcon } from '@chakra-ui/icons'
import {
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
    HStack,
    Button,
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
    Flex,
    Heading,
} from '@chakra-ui/react'
import { useMultiStyleConfig } from '@chakra-ui/system'
import React, { useEffect, useState } from 'react'
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
import useAVAFetch from '../../helpers/useAVAFetch'
import useAVASocket from '../../helpers/useAVASocket'
import { Battle } from '../../models/battle'
import { Strategy } from '../../models/strategy'
import { StrategyStatus } from '../../models/strategy-status'
import DocumentationTab from './DocumentationTab'
import EditStrategyName from './EditStrategyName'
import GameRulesTab from './GameRulesTab'
import SubmissionsTab from './SubmissionsTab'
import IdentityService from '../../data/IdentityService'
import { useNavigate } from 'react-router-dom'

interface IProgrammingSidebarProps {
    strategy: Strategy
    onStrategyChange: () => void
}

const ProgrammingSidebar = (p: IProgrammingSidebarProps) => {
    const navigate = useNavigate()
    const submitModal = useDisclosure()
    const unsubmitModal = useDisclosure()

    const [tabIndex, setTabIndex] = useState(0)
    const [submissions, setSubmissions] = useState<Battle[]>([])
    const [isWaitingOnSubmission, setIsWaitingOnSubmission] = useState(false)

    const onTestSubmissionResult = (response) => {
        const battle = response.resultingBattle as Battle
        const newSubmissions = [...submissions].filter((b) => b.id != battle.id)
        newSubmissions.unshift(battle)
        setSubmissions(newSubmissions)
        setIsWaitingOnSubmission(false)
    }

    const onSubmitStrategy = async () => {
        const res = await strategySubmit.execute()
        if (res.status == 200) {
            IdentityService.refreshIdentity()
            navigate(`/Strategy/${p.strategy.id}/Battles`)
        }
    }

    const onUnsubmitStrategy = async () => {
        const res = await strategyUnsubmit.execute()
        if (res.status == 200) {
            const newStrat = res.data as Strategy
            IdentityService.refreshIdentity()
            navigate(`/Programming/${newStrat.id}`)
        }
    }

    const submissionWebSocket = useAVASocket([
        { key: 'TestSubmissionResult', execute: onTestSubmissionResult },
    ])
    const gameFetch = useAVAFetch('/Games/1') // TODO: dynamically change on strategy gameid
    const strategySubmit = useAVAFetch(
        `/Strategy/Submit/${p.strategy.id}`,
        { method: 'POST' },
        { manual: true },
    )
    const strategyUnsubmit = useAVAFetch(
        `/Strategy/Unsubmit/${p.strategy.id}`,
        { method: 'POST' },
        { manual: true },
    )
    const strategyRun = useAVAFetch('/Strategy/TestStrategy/', { method: 'POST' }, { manual: true })
    // const game = gameFetch.data as Game
    const runStrategy = async (stock: number) => {
        const testStrategyRequest = {
            strategyIdToTest: p.strategy.id,
            stock,
            clientId: submissionWebSocket.connection?.connectionId,
        }
        const pendingBattle = (await strategyRun.execute({ data: testStrategyRequest }))
            .data as Battle
        const newSubmissions = [...submissions]
        newSubmissions.unshift(pendingBattle)
        setSubmissions(newSubmissions)
        setIsWaitingOnSubmission(true)
        setTabIndex(2)
    }

    const isLoading =
        gameFetch.isLoading ||
        strategySubmit.isLoading ||
        strategyRun.isLoading ||
        isWaitingOnSubmission

    // open unsubmit modal if strategy is active
    useEffect(() => {
        if (p.strategy.status == StrategyStatus.Active) unsubmitModal.onOpen()
    }, [])

    return (
        <Flex flexDir='column'>
            <HStack p={3}>
                <EditStrategyName strategy={p.strategy} onNameChange={p.onStrategyChange} />
                <Heading size='sm'>v{p.strategy.version}</Heading>
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
                                disabled={p.strategy.status == StrategyStatus.Active || isLoading}
                            />
                            <MenuList>
                                <MenuItem
                                    icon={<BsThermometerLow size={20} />}
                                    onClick={() => runStrategy(-1)}
                                >
                                    Test against EasyAI
                                </MenuItem>
                                <MenuItem
                                    icon={<BsThermometerHalf size={20} />}
                                    onClick={() => runStrategy(-2)}
                                >
                                    Test against MediumAI
                                </MenuItem>
                                <MenuItem
                                    icon={<BsThermometerHigh size={20} />}
                                    onClick={() => runStrategy(-3)}
                                >
                                    Test against HardAI
                                </MenuItem>
                            </MenuList>
                        </Menu>
                        <Button
                            rightIcon={<ArrowForwardIcon />}
                            disabled={p.strategy.status == StrategyStatus.Active || isLoading}
                            onClick={submitModal.onOpen}
                        >
                            Submit
                        </Button>
                    </HStack>
                </Stack>
            </HStack>
            <Tabs
                flexGrow={1}
                overflow='hidden'
                borderTopWidth={1}
                borderTopColor='chakra-border-color'
                orientation='vertical'
                variant='enclosed'
                index={tabIndex}
                onChange={setTabIndex}
            >
                <TabList height='100%'>
                    <Tooltip placement='right' label={'Game details'}>
                        <CustomTab>
                            <BsJoystick size={30} />
                        </CustomTab>
                    </Tooltip>
                    {/* <Tooltip placement='right' label={'Testing'}>
                        <CustomTab >
                            <BsPlay size={30} />
                        </CustomTab>
                    </Tooltip> */}
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
                <TabPanels borderLeftWidth={1} borderLeftColor='chakra-border-color'>
                    <TabPanel h='100%' overflowY='scroll'>
                        <GameRulesTab />
                        {/* <Heading fontSize='lg'>{game && game.name}</Heading>

                            <p>{game && game.longDescription}</p>
                            <a
                                href='https://docs.google.com/document/d/1gTAEE-0M2rklHGBfeS9CtV1GIerUqjE-Yyp2TkZ8RTU/edit#heading=h.hp2c6iz21hyn'
                                target='_blank'
                                rel='noreferrer'
                            >
                                <Button>Link to Documentation</Button>
                            </a>
                            <p>{game && game.longDescription}</p>
                            <p>{game && game.longDescription}</p>
                            <Box h='50' /> */}
                    </TabPanel>
                    {/* <TabPanel h='100%' overflowY='scroll'>
                        manual play gameboard here + step and eval buttons
                    </TabPanel> */}
                    <TabPanel h='100%' overflowY='scroll'>
                        <DocumentationTab strategy={p.strategy} />
                    </TabPanel>
                    <TabPanel h='100%' overflowY='scroll'>
                        <SubmissionsTab submissions={submissions} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Modal
                isOpen={submitModal.isOpen}
                closeOnOverlayClick={false}
                closeOnEsc={false}
                onClose={submitModal.onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmation</ModalHeader>
                    <ModalBody>
                        By submitting this strategy, you will matchmake with other strategies and be
                        unable to edit it&apos;s source code.
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant='ghost'
                            mr={3}
                            onClick={submitModal.onClose}
                            disabled={strategySubmit.isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => onSubmitStrategy()}
                            isLoading={strategySubmit.isLoading}
                            isDisabled={strategySubmit.isLoading}
                        >
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal
                isOpen={unsubmitModal.isOpen}
                closeOnOverlayClick={false}
                closeOnEsc={false}
                onClose={unsubmitModal.onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Cannot edit active strategy</ModalHeader>
                    <ModalBody>
                        This strategy is currently active, so most functionality of this page is
                        currently disabled. To use this page, this strategy must be unsubmitted and
                        its version number will be incremented. Would you like to do this?
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant='ghost'
                            mr={3}
                            onClick={unsubmitModal.onClose}
                            disabled={strategyUnsubmit.isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => onUnsubmitStrategy()}
                            isLoading={strategyUnsubmit.isLoading}
                            isDisabled={strategyUnsubmit.isLoading}
                        >
                            Unsubmit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
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
