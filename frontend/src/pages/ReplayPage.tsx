import React, { useEffect, useState } from 'react'
import GameboardViewer, { GAME_COLORS } from '../components/GameboardViewer'
import useAVAFetch from '../helpers/useAVAFetch'
import { BattleGame } from '../models/battle-game'
import {
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Tooltip,
    Spinner,
    Stack,
    HStack,
    IconButton,
    ButtonGroup,
    Select,
    Flex,
    Box,
    Heading,
    Center,
    Text,
    Spacer,
} from '@chakra-ui/react'
import { GoLock } from 'react-icons/go'
import { FaChessBoard } from 'react-icons/fa'
import { TbShield, TbSword } from 'react-icons/tb'
import {
    ArrowBackIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons'
import { MdPause, MdPlayArrow } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import { Battle } from '../models/battle'
import useDocumentTitle from '../hooks/useDocumentTitle'
import ReplayPageCodeViewer from '../components/ReplayPageCodeViewer'
import { Code, vs2015 } from 'react-code-blocks'

export const BOARD_SIZES = {
    DEFAULT: 600, // for replay view
    INTERACTIVE: 700, // for manual play
    RECAP: 150, // for list display
}

interface IReplayPageProps {
    battleId: string
    gameNumber: string
}

const ReplayPage = (p: IReplayPageProps) => {
    const navigate = useNavigate()
    // const { bid, gnum } = useParams()
    const [currentTurn, setCurrentTurn] = useState(0)
    const [showTooltip, setShowTooltip] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1)

    const { data, isLoading, error } = useAVAFetch(`/Battle/${p.battleId}/${p.gameNumber}`)
    const battleFetch = useAVAFetch(`/Battle/${p.battleId}/`)

    // reset current turn when navigating between games
    useEffect(() => {
        setCurrentTurn(0)
    }, [p.battleId, p.gameNumber])

    // update turn slider helper text on turn data load
    useEffect(() => {
        if (data) setCurrentTurn((data as BattleGame).turns.length)
    }, [data])

    // step though turns if is playing
    useEffect(() => {
        if (data == undefined) return
        const turns = (data as BattleGame).turns

        // stop playback at end
        if (currentTurn == turns.length) {
            setIsPlaying(false)
            return
        }

        // store timeout function for clearing later
        let interval

        // if playback is still valid, step through
        if (isPlaying && currentTurn < turns.length) {
            interval = setTimeout(
                () => setCurrentTurn((currentTurn) => currentTurn + 1),
                500 / speed,
            )
        } else clearInterval(interval)

        // kill timeout
        return () => clearInterval(interval)
    }, [isPlaying, currentTurn])

    // control handlers
    const goToFirstTurn = () => setCurrentTurn(0)
    const goBackATurn = () => {
        if (currentTurn > 0) setCurrentTurn(currentTurn - 1)
    }
    const onPlay = () => {
        if (data == undefined) return
        const turns = (data as BattleGame).turns

        // set to turn 0 if at end already
        if (currentTurn == turns.length) setCurrentTurn(0)

        setIsPlaying(!isPlaying)
    }
    const goForwardATurn = () => {
        if (currentTurn < turns.length) setCurrentTurn(currentTurn + 1)
    }
    const goToLastTurn = () => setCurrentTurn(turns.length)

    useDocumentTitle(
        battleFetch.data && data
            ? `Game ${(data as BattleGame).gameNumber} on ${
                  (battleFetch.data as Battle).name
              } Replay`
            : 'Replay',
    )

    if (isLoading || battleFetch.isLoading) return <Spinner />

    const battle = battleFetch.data as Battle
    const battleGame = data as BattleGame
    const turns = battleGame.turns
    const size = BOARD_SIZES.DEFAULT

    if (turns.length <= 0) return <Spinner />

    const goBackwardAGame = () =>
        navigate(`/Replay/${p.battleId}/${Number.parseInt(p.gameNumber!) - 1}`)
    const goForwardAGame = () =>
        navigate(`/Replay/${p.battleId}/${Number.parseInt(p.gameNumber!) + 1}`)

    const didWhiteWin =
        (battleGame.isAttackerWhite && battleGame.didAttackerWin) ||
        (!battleGame.isAttackerWhite && !battleGame.didAttackerWin)
    const didBlackWin = !didWhiteWin

    const didWinByElimination: boolean = battleGame.didAttackerWin
        ? battleGame.defenderPawnsLeft == 0
        : battleGame.attackerPawnsLeft == 0

    const isWhiteTurn =
        turns &&
        currentTurn > 0 &&
        ((battleGame.isAttackerWhite && turns[currentTurn - 1].isAttackTurn) ||
            (!battleGame.isAttackerWhite && !turns[currentTurn - 1].isAttackTurn))

    const isAttackerTurn = turns && currentTurn > 0 && turns[currentTurn - 1].isAttackTurn

    return (
        <Flex justifyContent='center'>
            <Stack w={size}>
                <Center>
                    <HStack spacing={2}>
                        <IconButton
                            tabIndex={-1}
                            aria-label='Go back a turn'
                            icon={<ChevronLeftIcon w='7' h='7' />}
                            variant='ghost'
                            onClick={goBackwardAGame}
                            isDisabled={battleGame.gameNumber <= 1}
                        />
                        <Heading fontSize='2xl'>Game {battleGame.gameNumber}</Heading>
                        <IconButton
                            tabIndex={-1}
                            aria-label='Go back a turn'
                            icon={<ChevronRightIcon w='7' h='7' />}
                            variant='ghost'
                            onClick={goForwardAGame}
                            isDisabled={battle && battleGame.gameNumber >= battle.iterations}
                        />
                    </HStack>
                </Center>
                <GameboardViewer
                    type='Non-interactive'
                    size={size}
                    turns={turns}
                    currentTurn={currentTurn}
                />
                <Slider
                    id='slider'
                    tabIndex={-1}
                    defaultValue={turns.length}
                    value={currentTurn}
                    min={0}
                    max={turns.length}
                    mx={5}
                    colorScheme='cyan'
                    onChange={(v) => setCurrentTurn(v)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <SliderMark value={turns.length / 40} mt='1' ml='-2.5' fontSize='sm'>
                        Turn 0
                    </SliderMark>
                    <SliderMark
                        value={turns.length / 2 - turns.length / 30}
                        mt='1'
                        ml='-2.5'
                        fontSize='sm'
                        textAlign='center'
                    >
                        Turn {currentTurn}
                    </SliderMark>
                    <SliderMark
                        value={turns.length - turns.length / 10}
                        mt='1'
                        ml='-2.5'
                        fontSize='sm'
                    >
                        Turn {turns.length}
                    </SliderMark>
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <Tooltip
                        hasArrow
                        bg='cyan.500'
                        color='white'
                        placement='top'
                        isOpen={showTooltip}
                        label={`Turn ${currentTurn}`}
                    >
                        <SliderThumb tabIndex={-1} />
                    </Tooltip>
                </Slider>
                <HStack pt='5' justifyContent='center'>
                    <ButtonGroup size='sm' isAttached variant='outline'>
                        <IconButton
                            tabIndex={-1}
                            aria-label='Go to first turn'
                            icon={<ArrowLeftIcon />}
                            onClick={goToFirstTurn}
                            isDisabled={currentTurn == 0}
                        />
                        <IconButton
                            tabIndex={-1}
                            aria-label='Go back a turn'
                            icon={<ChevronLeftIcon w='7' h='7' />}
                            onClick={goBackATurn}
                            isDisabled={currentTurn == 0}
                        />
                        <IconButton
                            tabIndex={-1}
                            aria-label='Toggle play/pause'
                            icon={isPlaying ? <MdPause size={20} /> : <MdPlayArrow size={20} />}
                            onClick={onPlay}
                        />
                        <IconButton
                            tabIndex={-1}
                            aria-label='Go forward a turn'
                            icon={<ChevronRightIcon w='7' h='7' />}
                            onClick={goForwardATurn}
                            isDisabled={currentTurn == turns.length}
                        />
                        <IconButton
                            tabIndex={-1}
                            aria-label='Go to last turn'
                            icon={<ArrowRightIcon />}
                            onClick={goToLastTurn}
                            isDisabled={currentTurn == turns.length}
                        />
                    </ButtonGroup>
                    <Select
                        width='18'
                        defaultValue='1'
                        size='sm'
                        onChange={(e) => setSpeed(Number.parseFloat(e.target.value))}
                        isDisabled={isPlaying}
                    >
                        <option value='0.5'>x0.5</option>
                        <option value='1'>x1</option>
                        <option value='2'>x2</option>
                        <option value='4'>x4</option>
                        <option value='8'>x8</option>
                    </Select>
                </HStack>
            </Stack>
            <Box bg='whiteAlpha.200' flexGrow={1} ml='6' mr='3' borderRadius={3} maxW='xl'>
                <Stack p='3'>
                    <HStack>
                        <Stack>
                            <HStack>
                                <Box
                                    w='5'
                                    h='5'
                                    borderRadius='5'
                                    borderColor={GAME_COLORS.BLACK_PIECE.STROKE}
                                    borderWidth='2px'
                                    backgroundColor={GAME_COLORS.BLACK_PIECE.FILL}
                                />
                                {!battleGame.isAttackerWhite ? (
                                    <TbSword size='15' />
                                ) : (
                                    <TbShield size='15' />
                                )}
                                <Text>
                                    {!battleGame.isAttackerWhite
                                        ? battle.attackingStrategy.name
                                        : battle.defendingStrategy.name}
                                </Text>
                                {currentTurn > 0 && !isWhiteTurn && <ArrowBackIcon w={5} h={5} />}
                            </HStack>
                            <HStack>
                                <Box
                                    w='5'
                                    h='5'
                                    borderRadius='5'
                                    borderColor={GAME_COLORS.WHITE_PIECE.STROKE}
                                    borderWidth='2px'
                                    backgroundColor={GAME_COLORS.WHITE_PIECE.FILL}
                                />
                                {battleGame.isAttackerWhite ? (
                                    <TbSword size='15' />
                                ) : (
                                    <TbShield size='15' />
                                )}
                                <Text>
                                    {battleGame.isAttackerWhite
                                        ? battle.attackingStrategy.name
                                        : battle.defendingStrategy.name}
                                </Text>
                                {currentTurn > 0 && isWhiteTurn && <ArrowBackIcon w={5} h={5} />}
                            </HStack>
                        </Stack>
                        <Spacer />
                        {turns && currentTurn > 0 && (
                            <Stack>
                                <Text>{isWhiteTurn ? 'White' : 'Black'} returned:</Text>
                                <Code
                                    customStyle={{
                                        textAlign: 'center',
                                    }}
                                    text={`"${turns[currentTurn - 1].turnData}"`}
                                    language='javascript'
                                    theme={vs2015}
                                />
                            </Stack>
                        )}
                    </HStack>
                    <Text fontSize='xs'>
                        {didBlackWin ? 'Black' : 'White'} won by{' '}
                        {didWinByElimination
                            ? `eliminating  ${didBlackWin ? 'White' : 'Black'}'s pawns`
                            : 'scoring a touchdown (or other cases).'}
                    </Text>
                    {currentTurn <= 0 && (
                        <Center px='10'>
                            <Stack mt='48' alignItems='center'>
                                <FaChessBoard size={40} />
                                <Text fontSize='3xl'>Starting state</Text>
                                <Text fontSize='md'>
                                    Turn 0 is the initial state of the board. In 1234Chess, white
                                    will move first next turn.
                                </Text>
                            </Stack>
                        </Center>
                    )}
                    <Box display={currentTurn > 0 && isAttackerTurn ? 'block' : 'none'}>
                        {battle.attackingStrategySnapshot ? (
                            <ReplayPageCodeViewer
                                sourceCode={battle.attackingStrategySnapshot}
                                executionTrace={
                                    turns && currentTurn > 0
                                        ? turns[currentTurn - 1].linesExecuted!
                                        : undefined
                                }
                                printOutput={
                                    turns && currentTurn > 0
                                        ? turns[currentTurn - 1].printInfo!
                                        : undefined
                                }
                            />
                        ) : (
                            <Center px='10'>
                                <Stack mt='48' alignItems='center'>
                                    <GoLock size={40} />
                                    <Text fontSize='3xl'>Source code is private</Text>
                                    <Text fontSize='md'>
                                        The attacker strategy&apos;s user does not want the source
                                        code to be public.
                                    </Text>
                                </Stack>
                            </Center>
                        )}
                    </Box>
                    <Box display={currentTurn > 0 && !isAttackerTurn ? 'block' : 'none'}>
                        {battle.defendingStrategySnapshot ? (
                            <ReplayPageCodeViewer
                                sourceCode={battle.defendingStrategySnapshot}
                                executionTrace={
                                    turns && currentTurn > 0
                                        ? turns[currentTurn - 1].linesExecuted!
                                        : undefined
                                }
                            />
                        ) : (
                            <Center px='10'>
                                <Stack mt='48' alignItems='center'>
                                    <GoLock size={40} />
                                    <Text fontSize='3xl'>Source code is private</Text>
                                    <Text fontSize='md'>
                                        The defending strategy&apos;s user does not want the source
                                        code to be public.
                                    </Text>
                                </Stack>
                            </Center>
                        )}
                    </Box>
                </Stack>
            </Box>
        </Flex>
    )
}

export default ReplayPage
