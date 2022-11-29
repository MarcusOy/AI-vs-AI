import React from 'react'
import {
    Code,
    Center,
    Box,
    Stack,
    Text,
    Alert,
    AlertDescription,
    AlertTitle,
} from '@chakra-ui/react'
import { Strategy } from '../../models/strategy'

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
        <Stack>
            {p.strategy.sourceCode != null && p.strategy.isPrivate && (
                <Alert status='success'>
                    <GoLock />
                    <Box ml='3'>
                        <AlertTitle>Private strategy</AlertTitle>
                        <AlertDescription>
                            You&apos;ve set this strategy&apos;s visibility to Private, which means
                            no one except you can see the source code below.
                        </AlertDescription>
                    </Box>
                </Alert>
            )}
            <Box overflowX='scroll'>
                <Code>
                    <pre>{p.strategy.sourceCode}</pre>
                </Code>
            </Box>
        </Stack>
    )
}

export default StrategySourceCodeTab
