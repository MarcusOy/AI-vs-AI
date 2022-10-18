import { Stack } from '@chakra-ui/react'
import React from 'react'
import GameboardViewer from '../components/GameboardViewer'

const ReplayPage = () => {
    return (
        <div>
            <GameboardViewer type='Non-interactive' size={600} />
        </div>
    )
}

export default ReplayPage
