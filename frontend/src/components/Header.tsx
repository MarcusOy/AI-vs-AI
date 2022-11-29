import React from 'react'
import { Box, Button, Heading, HStack, IconButton, useColorMode } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { ArrowUpDownIcon, BellIcon, MoonIcon, SearchIcon, SunIcon } from '@chakra-ui/icons'
import CurrentAccountButton from './CurrentAccountButton'
import ModalService from '../data/ModalService'

interface IHeader {
    isLoggedIn: boolean
}

const Header = (props: IHeader) => {
    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <Box
            as='header'
            borderBottomWidth='1px'
            background='chakra-body-bg'
            py='1rem'
            position='sticky'
            zIndex={999}
            top={0}
            left={0}
            right={0}
        >
            <HStack px='1rem' maxWidth='8xl' marginInline='auto'>
                <Link to='/'>
                    <HStack>
                        <Box
                            background='cyan.500'
                            borderRadius={20}
                            w={9}
                            h={9}
                            alignItems='center'
                            justifyContent='center'
                            display='flex'
                        >
                            <ArrowUpDownIcon fontSize='2xl' color='white' />
                        </Box>
                        <Heading fontWeight='bold' fontSize='3xl'>
                            AI vs AI
                        </Heading>
                    </HStack>
                </Link>
                <HStack
                    display={['none', 'none', 'flex']}
                    flexGrow={1}
                    alignItems='center'
                    justifyContent='end'
                >
                    <IconButton
                        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        variant='ghost'
                        onClick={toggleColorMode}
                        aria-label={'Toggle color mode'}
                    />
                    {props.isLoggedIn == false ? (
                        <>
                            <Link to='/Auth/Login'>
                                <Button variant='outline'>Login</Button>
                            </Link>
                            <Link to='/Auth/Signup'>
                                <Button>Signup</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <IconButton
                                variant='ghost'
                                icon={<BellIcon w='5' h='5' />}
                                aria-label={'View notifications'}
                            />
                            <IconButton
                                variant='ghost'
                                icon={<SearchIcon w='4' h='4' />}
                                aria-label={'Search...'}
                                onClick={() => ModalService.openSearchModal()}
                            />
                            <CurrentAccountButton />
                        </>
                    )}
                </HStack>
            </HStack>
        </Box>
    )
}

export default Header
