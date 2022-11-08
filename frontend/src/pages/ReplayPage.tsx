import React, { useEffect, useState } from 'react'
import GameboardViewer from '../components/GameboardViewer'
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
} from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { MdPause, MdPlayArrow } from 'react-icons/md'
import { useParams } from 'react-router-dom'

export const BOARD_SIZES = {
    DEFAULT: 600, // for replay view
    INTERACTIVE: 700, // for manual play
    RECAP: 150, // for list display
}

const ReplayPage = () => {
    const { bid, gnum } = useParams()
    const [currentTurn, setCurrentTurn] = useState(0)
    const [showTooltip, setShowTooltip] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1)

    const { data, isLoading, error } = useAVAFetch(`/Battle/${bid}/${gnum}`)

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

    if (isLoading) return <Spinner />

    const turns = (data as BattleGame).turns
    const size = BOARD_SIZES.DEFAULT

    return (
        <Stack w={size}>
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
                <SliderMark value={turns.length - turns.length / 10} mt='1' ml='-2.5' fontSize='sm'>
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
    )
}

export default ReplayPage
