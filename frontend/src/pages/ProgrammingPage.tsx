import React from 'react'
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Center,
    Spinner,
    Stack,
    Text,
    Link,
} from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import useAVAFetch from '../helpers/useAVAFetch'
import Split from 'react-split'
import { Strategy } from '../models/strategy'
import ProgrammingEditor from '../components/programming/ProgrammingEditor'
import ProgrammingSidebar from '../components/programming/ProgrammingSidebar'
import { WarningIcon } from '@chakra-ui/icons'
import useDocumentTitle from '../hooks/useDocumentTitle'
function ProgrammingPage() {
    const { id } = useParams()
    const { data, isLoading, error, execute } = useAVAFetch(`/getAi/${id}`)

    const strategy = data as Strategy

    useDocumentTitle(strategy ? `✏️ ${strategy.name}` : 'Programming Page')

    if (isLoading || strategy == undefined)
        return (
            <Center mt='10'>
                <Spinner />
            </Center>
        )
    if (error)
        return (
            <Center>
                <Stack spacing='10'>
                    <Stack mt='48' alignItems='center'>
                        <WarningIcon w={50} h={50} />
                        <Text fontSize='5xl'>Strategy not found</Text>
                        <Text fontSize='lg'>
                            The strategy you are trying to edit could not be found.
                        </Text>
                        <Link onClick={() => history.back()} color='teal.500'>
                            Go back to where you came from.
                        </Link>
                    </Stack>
                    <Alert status='error'>
                        <AlertIcon />
                        <AlertTitle>Error.</AlertTitle>
                        <AlertDescription>{error?.response?.data}</AlertDescription>
                    </Alert>
                </Stack>
            </Center>
        )

    return (
        <Box position='fixed' left={0} right={0} bottom={0} top='4.6rem' pt='0'>
            <Split
                sizes={[45, 55]}
                className='split'
                minSize={450}
                gutterAlign='start'
                snapOffset={0}
                style={{ height: '100%' }}
            >
                <ProgrammingSidebar
                    strategy={strategy}
                    onStrategyChange={() => execute()}
                ></ProgrammingSidebar>
                <ProgrammingEditor strategy={strategy} onStrategyChange={() => execute()} />
            </Split>
        </Box>
    )
}

export default ProgrammingPage