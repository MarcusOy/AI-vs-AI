import { WarningIcon } from '@chakra-ui/icons'
import {
    Center,
    Stack,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Text,
    Link,
} from '@chakra-ui/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import ReplayPage from './ReplayPage'

const ReplayWrapperPage = () => {
    const { bid, gnum } = useParams()

    if (!bid || !gnum)
        return (
            <Center>
                <Stack spacing='10'>
                    <Stack mt='48' alignItems='center'>
                        <WarningIcon w={50} h={50} />
                        <Text fontSize='5xl'>Replay not found</Text>
                        <Text fontSize='lg'>
                            The battle game you are trying to view could not be found.
                        </Text>
                        <Link onClick={() => history.back()} color='teal.500'>
                            Go back to where you came from.
                        </Link>
                    </Stack>
                </Stack>
            </Center>
        )

    return <ReplayPage battleId={bid} gameNumber={gnum} />
}

export default ReplayWrapperPage
