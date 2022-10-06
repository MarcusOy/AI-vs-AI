import { Center, Link, Stack, Text } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

const NotFoundPage = () => {
    return (
        <Center>
            <Stack mt='48' alignItems='center'>
                <WarningIcon w={50} h={50} />
                <Text fontSize='5xl'>404: Page Not Found</Text>
                <Text fontSize='lg'>
                    It looks like the page you were looking for was not found.
                </Text>
                <Text color='teal.500'>
                    <RouterLink to='/'>Go back to the home page.</RouterLink>
                </Text>
            </Stack>
        </Center>
    )
}

export default NotFoundPage
