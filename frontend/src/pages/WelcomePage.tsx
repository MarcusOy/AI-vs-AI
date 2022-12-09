import React from 'react'
import { Center, Box, Heading, Text, Button, Select } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
const WelcomePage = () => {
    return (
        <Center>
            <Box maxW='32rem'>
                <Heading paddingTop={'5rem'} paddingBottom='1rem' mb={4} size={'3xl'} textAlign='center'>Innovate. Iterate. <Heading size={'3xl'} color='tomato'>Obliterate.</Heading></Heading>
                <Text textAlign={'center'} color='lightgray'>Experience satisfying AI vs AI battles through an unprecedented level of control...</Text>
                <Center>
                    <Button size='lg' mt='24px'>
                        <Link to='/Auth/Login'>Login/Signup to begin your journey</Link>
                    </Button>
                </Center>
            </Box>
        </Center>
    )
}

export default WelcomePage
