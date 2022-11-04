import React, { useState } from 'react'
import { Code, Center, Box, Stack, Text } from '@chakra-ui/react'
import useAVAFetch from '../../helpers/useAVAFetch'
import { useParams } from 'react-router-dom'
import { Strategy } from '../../models/strategy'
import { AVAStore } from '../../data/DataStore'

import { GoLock } from 'react-icons/go'
interface StrategySourceCodeTab {
    strategy: Strategy
}

const StrategySourceCodeTab = (p: StrategySourceCodeTab) => {
    if (p.strategy.sourceCode == null)
        return (
            <Center>
                <Stack mt='48' alignItems='center'>
                    <GoLock size={50} />
                    <Text fontSize='5xl'>Source code is private</Text>
                    <Text fontSize='lg'>
                        The user who created this strategy does not want the source code to be
                        public.
                    </Text>
                </Stack>
            </Center>
        )

    return (
        <Box overflowX='scroll'>
            <Code>
                <pre>{p.strategy.sourceCode}</pre>
            </Code>
        </Box>
    )
}

export default StrategySourceCodeTab
