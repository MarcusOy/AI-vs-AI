import { HamburgerIcon } from '@chakra-ui/icons'
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Heading,
    Stack,
    Text,
    Link,
    Spinner,
    HStack,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
    IconButton,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { IoAlertCircle, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import { TbShield, TbSword } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { Battle } from '../../models/battle'
import { BattleStatus } from '../../models/battle-status'
import ReplayPage, { BOARD_SIZES } from '../../pages/ReplayPage'
import GameboardViewer, { GAME_COLORS } from '../GameboardViewer'

interface ISubmissionsTabProps {
    submissions: Battle[]
}

const SubmissionsTab = (p: ISubmissionsTabProps) => {
    const navigate = useNavigate()

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedBattle, setSelectedBattle] = useState('')

    const openReplay = (battleId: string) => {
        setSelectedBattle(battleId)
        onOpen()
    }

    return (
        <Stack>
            <Heading fontSize='lg'>Submissions</Heading>

            <Accordion allowToggle>
                {p.submissions.map((s, key) => {
                    console.log(s)
                    const g = s.battleStatus != BattleStatus.Pending ? s.battleGames[0] : undefined
                    const finalBoard = g ? (JSON.parse(g.finalBoard) as string[][]) : []

                    const didWhiteWin = g
                        ? (g.isAttackerWhite && g.didAttackerWin) ||
                          (!g.isAttackerWhite && !g.didAttackerWin)
                        : false
                    const didBlackWin = !didWhiteWin

                    return (
                        <AccordionItem key={key}>
                            <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        <HStack>
                                            {s.battleStatus == BattleStatus.Pending ? (
                                                <>
                                                    <Spinner size='sm' />{' '}
                                                    <Heading fontSize='md'>Pending {' - '}</Heading>
                                                </>
                                            ) : s.battleStatus == BattleStatus.Fail ? (
                                                <>
                                                    <IoAlertCircle size='20' color='red' />{' '}
                                                    <Heading fontSize='md'>Fail {' - '}</Heading>
                                                </>
                                            ) : s.attackerWins > s.defenderWins ? (
                                                <>
                                                    <IoCheckmarkCircle size='20' color='green' />{' '}
                                                    <Heading fontSize='md'> Win {' - '}</Heading>
                                                </>
                                            ) : (
                                                <>
                                                    <IoCloseCircle size='20' color='red' />{' '}
                                                    <Heading fontSize='md'>
                                                        Loss
                                                        {' - '}
                                                    </Heading>
                                                </>
                                            )}
                                            <Text
                                                overflow='hidden'
                                                textOverflow='ellipsis'
                                                whiteSpace='nowrap'
                                            >
                                                vs.{' '}
                                                {s.defendingStrategy.name.length > 20
                                                    ? s.defendingStrategy.name.substring(0, 20) +
                                                      '...'
                                                    : s.defendingStrategy.name}
                                            </Text>
                                        </HStack>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                {g == undefined && (
                                    <Text>
                                        This game is currently pending. Please wait for results.
                                    </Text>
                                )}
                                {g && (
                                    <HStack
                                        cursor='pointer'
                                        onClick={() => openReplay(s.id)}
                                        p={4}
                                        spacing={4}
                                        borderRadius={4}
                                        _hover={{
                                            backgroundColor: 'whiteAlpha.100',
                                            transition: 'background-color 200ms',
                                        }}
                                    >
                                        <GameboardViewer
                                            type='Non-interactive'
                                            size={BOARD_SIZES.RECAP}
                                            board={finalBoard}
                                        />
                                        <Stack spacing={1}>
                                            <Heading size='lg'>
                                                {g.didAttackerWin ? 'Win' : 'Loss'}
                                            </Heading>
                                            <HStack>
                                                <Box
                                                    w='5'
                                                    h='5'
                                                    borderRadius='5'
                                                    borderColor={GAME_COLORS.BLACK_PIECE.STROKE}
                                                    borderWidth='2px'
                                                    backgroundColor={GAME_COLORS.BLACK_PIECE.FILL}
                                                    flexShrink={0}
                                                />
                                                {!g.isAttackerWhite ? (
                                                    <TbSword size='15' />
                                                ) : (
                                                    <TbShield size='15' />
                                                )}
                                                <Text
                                                    fontWeight={didBlackWin ? 'bolder' : 'normal'}
                                                    overflow='hidden'
                                                    textOverflow='ellipsis'
                                                    whiteSpace='nowrap'
                                                >
                                                    {!g.isAttackerWhite
                                                        ? s.attackingStrategy.name
                                                        : s.defendingStrategy.name}
                                                </Text>
                                            </HStack>
                                            <HStack>
                                                <Box
                                                    w='5'
                                                    h='5'
                                                    borderRadius='5'
                                                    borderColor={GAME_COLORS.WHITE_PIECE.STROKE}
                                                    borderWidth='2px'
                                                    backgroundColor={GAME_COLORS.WHITE_PIECE.FILL}
                                                    flexShrink={0}
                                                />
                                                {g.isAttackerWhite ? (
                                                    <TbSword size='15' />
                                                ) : (
                                                    <TbShield size='15' />
                                                )}
                                                <Text
                                                    fontWeight={didWhiteWin ? 'bolder' : 'normal'}
                                                    overflow='hidden'
                                                    textOverflow='ellipsis'
                                                    whiteSpace='nowrap'
                                                >
                                                    {g.isAttackerWhite
                                                        ? s.attackingStrategy.name
                                                        : s.defendingStrategy.name}
                                                </Text>
                                            </HStack>
                                            <Text fontSize='sm' fontWeight='bold'>
                                                Turns:{' '}
                                                <Text
                                                    as='span'
                                                    color='cyan.300'
                                                    fontWeight='normal'
                                                >
                                                    {g.turns.length}
                                                </Text>
                                            </Text>
                                        </Stack>
                                    </HStack>
                                )}
                                {g &&        <Popover placement='bottom' matchWidth={true} size='sm'>
                                    <PopoverTrigger>
                                        <Button rightIcon={<HamburgerIcon />}>Basic Robustness Tests</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverBody>
                                            <VStack>
                                                {s.testSuiteResult?.split('\n').map((t, i) => {
                                                    if (t.length >= 3) {
                                                        return (<Box display={'inherit'} gap='2' key={i}>
                                                            <Text color={t.charAt(1) == 'P' ? 'green' : 'red'}>{t.substring(3)}</Text>
                                                    
                                                        </Box>)
                                                    }
                                                }
                                                )}
                                        
                                    </VStack>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>}
                            </AccordionPanel>
                        </AccordionItem>
                    )
                })}
            </Accordion>

            <Stack spacing={0}>
                {p.submissions.length <= 0 && <Text>No submissions from this session.</Text>}
                <Link onClick={() => navigate('/Profile/Submissions')} color='teal.500'>
                    View previous submissions
                </Link>
            </Stack>

            <Modal isOpen={isOpen} onClose={onClose} size={'full'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody pt={12}>
                        <ReplayPage battleId={selectedBattle} gameNumber='1' />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Stack>
    )
}

export default SubmissionsTab
