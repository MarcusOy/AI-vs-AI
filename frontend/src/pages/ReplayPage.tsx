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
} from '@chakra-ui/react'

export const BOARD_SIZES = {
    DEFAULT: 600, // for replay view
    INTERACTIVE: 700, // for manual play
    RECAP: 150, // for list display
}

const ReplayPage = () => {
    const [currentTurn, setCurrentTurn] = useState(0)
    const [showTooltip, setShowTooltip] = useState(false)
    const {
        data: bData,
        isLoading: bIsLoading,
        error: bError,
    } = useAVAFetch('/Battle/24095136-3123-4eb0-88cf-bd3e875a3adc')
    const {
        data: gData,
        isLoading: gIsLoading,
        error: gError,
    } = useAVAFetch('/Battle/24095136-3123-4eb0-88cf-bd3e875a3adc/7')

    // update turn slider helper text on turn data load
    useEffect(() => {
        if (gData) setCurrentTurn((gData as BattleGame).turns.length)
    }, [gData])

    if (bIsLoading || gIsLoading) return <Spinner />

    const turns = (gData as BattleGame).turns
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
                defaultValue={turns.length}
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
                <SliderMark value={turns.length / 2} mt='1' ml='-2.5' fontSize='sm'>
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
                    <SliderThumb />
                </Tooltip>
            </Slider>
        </Stack>
    )
}

export default ReplayPage
