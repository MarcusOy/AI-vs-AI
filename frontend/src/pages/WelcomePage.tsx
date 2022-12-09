import React from 'react'
import {
    Center,
    Box,
    Image,
    Heading,
    Flex,
    Text,
    Button,
    VStack,
    Spacer,
    HStack,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { CodeBlock, tomorrowNight } from 'react-code-blocks'
import { ArrowRightIcon } from '@chakra-ui/icons'
import ManualPlayPage from './ManualPlayPage'
import GameRulesTab from '../components/programming/GameRulesTab'
const WelcomePage = () => {
    return (
        <VStack>
            <Box maxW='32rem' paddingBottom={'3rem'}>
                <Heading
                    paddingTop={'5rem'}
                    paddingBottom='1rem'
                    mb={4}
                    size={'3xl'}
                    textAlign='center'
                >
                    Innovate. Iterate.{' '}
                    <Heading size={'3xl'} color='tomato'>
                        Obliterate.
                    </Heading>
                </Heading>
                <Text textAlign={'center'} color='lightgray'>
                    Experience satisfying AI vs AI battles through an unprecedented level of
                    control.
                </Text>
                <Center>
                    <Button size='lg' mt='24px'>
                        <Link to='/Auth/Login'>Login/Signup to begin</Link>
                    </Button>
                </Center>
            </Box>
            <Box paddingBottom={'3rem'} width='65vw'>
                <Center paddingBottom={'1rem'}>
                    <Heading size={'xl'}>How to begin</Heading>
                </Center>
                <Flex gap={'3'}>
                    <Box
                        borderRadius={'2xl'}
                        borderColor='white'
                        bgColor={'gray.700'}
                        color={'white'}
                        p='6'
                        w='13vw'
                    >
                        <Heading size={'sm'}>1. Log In</Heading>
                        <Text>Sign into your account to gain access to the feed page.</Text>
                    </Box>
                    <Spacer />
                    <Box
                        borderRadius={'2xl'}
                        borderColor='white'
                        bgColor={'gray.700'}
                        color={'white'}
                        p='6'
                        w='13vw'
                    >
                        <Heading size={'sm'}>2. Create Draft</Heading>
                        <Text>
                            From the feed page, click Draft AI button and select a save for your new
                            draft.
                        </Text>
                    </Box>
                    <Spacer />
                    <Box
                        borderRadius={'2xl'}
                        borderColor='white'
                        bgColor={'gray.700'}
                        color={'white'}
                        p='6'
                        w='13vw'
                    >
                        <Heading size={'sm'}>3. Code Your Own</Heading>
                        <Text>
                            Edit and improve on the starter code as you test your implementation
                            against multiple difficulties of stock strategies.
                        </Text>
                    </Box>
                    <Spacer />
                    <Box
                        borderRadius={'2xl'}
                        borderColor='white'
                        bgColor={'gray.700'}
                        color={'white'}
                        p='6'
                        w='13vw'
                    >
                        <Heading size={'sm'}>4. Submit Your Strategy</Heading>
                        <Text>
                            When confident in your implementation, submit your strategy to see how
                            it ranks against other players&apos; submissions.
                        </Text>
                    </Box>
                </Flex>
            </Box>
            <Box paddingBottom={'3rem'}>
                <Center paddingBottom={'1rem'}>
                    <Heading size={'xl'}>Code your own...</Heading>
                </Center>
                <Image src={'./ProgrammingPageDefault.png'}></Image>
            </Box>
            <Box paddingBottom={'3rem'} textAlign={'center'}>
                <Center paddingBottom={'1rem'}>
                    <Heading size={'xl'}>Or play manually...</Heading>
                </Center>
                <HStack alignItems='start'>
                    <Box borderWidth={1} borderRadius={5} p={5} height='100%'>
                        <GameRulesTab />
                    </Box>
                    <ManualPlayPage />
                </HStack>
            </Box>
            <Box width={'32vw'} textAlign={'center'}>
                <Center paddingBottom={'1rem'}>
                    <Heading size={'xl'}>
                        As you discover your hidden potential in our unique chess variation
                    </Heading>
                </Center>
            </Box>
            {/* <Box width={'32vw'} textAlign={'center'} paddingBottom={'3rem'}>
            </Box> */}
            <Center paddingBottom={'3rem'}>
                <Button size='lg' mt='24px'>
                    <Link to='/Auth/Login'>Chart your journey today</Link>
                    <ArrowRightIcon ml='3' />
                </Button>
            </Center>
        </VStack>
    )
}

export default WelcomePage
