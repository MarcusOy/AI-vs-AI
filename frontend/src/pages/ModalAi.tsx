import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Center,
    chakra,
    Flex,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
    useRadio,
    useRadioGroup,
    VStack,
} from '@chakra-ui/react'
import { AVAStore } from '../data/DataStore'
import useAVAFetch from '../helpers/useAVAFetch'
import { useNavigate } from 'react-router-dom'
import { Strategy } from '../models/strategy'
import { StrategyStatus } from '../models/strategy-status'
import IdentityService from '../data/IdentityService'
import { devComplete, helperFunctions } from '../helpers/hardcodeAi'
import { Game } from '../models/game'
import Moment from 'react-moment'
interface ModalAiProps {
    overwrite: boolean
    strategy?: Strategy
}
const ModalAi = (props: ModalAiProps) => {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { whoAmI } = AVAStore.useState()
    const { data } = useAVAFetch('/Games/')
    const [selected, setSelected] = useState('0')
    const [strats, setStrats] = useState<Strategy[]>([])
    const { isLoading, error, execute } = useAVAFetch(
        '/Strategy',
        { method: 'PUT' },
        { manual: true },
    )
    const duplicate = useAVAFetch(
        '/Strategy/Duplicate/',
        { method: 'PUT' },
        { manual: true },
    ).execute
    const options = data === undefined ? [{ name: '1234 Chess', id: 1 }] : data
    const openStrats = [
        { name: 'Free Save', sourceCode: '', id: '-1' },
        { name: 'Free Save', sourceCode: '', id: '-2' },
        { name: 'Free Save', sourceCode: '', id: '-3' },
    ]
    const strategies = whoAmI?.strategies || []
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'framework',
        onChange: setSelected,
    })
    const group = getRootProps()
    // useEffect(() => {
    //     if (!props.overwrite) {
    //         IdentityService.refreshIdentity()
    //     }
    // }, [])
    useEffect(() => {
        let count = 0
        const game = { id: 1 }
        let toAdd: Strategy[] = []
        strategies.forEach((n) => {
            if (n.gameId === game.id) {
                count++
                toAdd = [...toAdd, n]
            }
        })
        openStrats.forEach((n, key) => {
            if (count + key < 3) {
                toAdd = [...toAdd, n]
            }
        })
        setStrats((past) => [...past, ...toAdd])
    }, [strategies])
    const handleSubmit = async () => {
        let value
        strats.forEach((n) => {
            if (n.id === selected) {
                value = n
            }
        })
        if (props.overwrite && props.strategy === undefined) {
            return
        }
        if (value === undefined) return
        if (value.name === 'Free Save' && whoAmI !== undefined) {
            const build: Strategy = props.overwrite
                ? props.strategy
                : {
                      gameId: 1,
                      name: 'Untitled Draft',
                      sourceCode: helperFunctions + devComplete,
                  }
            const response = await execute({ data: build })
            console.log(response)
            IdentityService.refreshIdentity()
            navigate('/Programming/' + response.data.id)
        } else if (props.overwrite) {
            const response = await duplicate({
                url: '/Strategy/Duplicate/' + value.id,
                data: props.strategy,
            })
            console.log(response)
            IdentityService.refreshIdentity()
            navigate('/Programming/' + response.data.id)
        } else {
            navigate('/Programming/' + value.id)
        }
    }
    const findDrafts = (game: Game) => {
        let count = 0
        return (
            <HStack m={4}>
                {strategies.map((n, key) => {
                    if (n.gameId === game.id) {
                        count++
                        const value = n.id
                        const radio = getRadioProps({ value })
                        return (
                            <Box
                                key={key}
                                borderWidth='1px'
                                borderRadius='lg'
                                p='2'
                                width='33%'
                                height='40vh'
                            >
                                <RadioCard key={value} {...radio}>
                                    {n.name}
                                </RadioCard>
                                <StrategyStats strategy={n} />
                            </Box>
                        )
                    }
                })}
                {openStrats.map((n, key) => {
                    if (count + key < 3) {
                        const value = n.id
                        const radio = getRadioProps({ value })
                        return (
                            <Box
                                key={key}
                                borderWidth='1px'
                                borderRadius='lg'
                                p='2'
                                width='33%'
                                height='40vh'
                            >
                                <RadioCard key={value} {...radio}>
                                    {n.name}
                                </RadioCard>
                                <Center>
                                    <Box
                                        color='gray.500'
                                        fontWeight='semibold'
                                        letterSpacing='wide'
                                        fontSize='xs'
                                        textTransform='uppercase'
                                        ml='2'
                                        mt='2'
                                    >
                                        0 wins &bull; 0 losses
                                    </Box>
                                </Center>
                            </Box>
                        )
                    }
                })}
            </HStack>
        )
    }
    return (
        <>
            {!props.overwrite && <Button onClick={onOpen}>Draft AI</Button>}
            {props.overwrite && (
                <Button variant='link' onClick={onOpen}>
                    Duplicate
                </Button>
            )}
            <Modal isOpen={isOpen} onClose={onClose} size={'full'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Select a Draft Save</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Tabs variant='enclosed'>
                            <TabList>
                                {options?.map((value, key) => {
                                    return (
                                        <Tab key={key} isDisabled={value.id !== 1}>
                                            {value.name}
                                        </Tab>
                                    )
                                })}
                            </TabList>
                            <TabPanels>
                                {options?.map((value, key) => {
                                    return <TabPanel key={key}>{findDrafts(value)}</TabPanel>
                                })}
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button colorScheme='blue' onClick={() => handleSubmit()}>
                            {props.overwrite ? 'Overwrite' : 'Select'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
function StrategyStats(props) {
    const { isLoading, data } = useAVAFetch('/GetStats/StratId/' + props.strategy.id)
    interface result {
        win: number
        loss: number
    }
    const [stats, setStats] = useState<result>({ wins: 0, losses: -1 })
    useEffect(() => {
        if (!isLoading) {
            setStats(data)
        }
    }, [isLoading])
    return (
        <VStack>
            <Box
                color='gray.500'
                fontWeight='semibold'
                letterSpacing='wide'
                fontSize='xs'
                textTransform='uppercase'
                ml='2'
                mt='2'
            >
                {stats.win} wins &bull; {stats.loss} losses
            </Box>
            <Box
                color='gray.500'
                fontWeight='semibold'
                letterSpacing='wide'
                fontSize='xs'
                ml='2'
                mt='2'
            >
                Created:
                <Moment format=' HH:MM MM/DD/YYYY'>{props.strategy.createdOn}</Moment>
            </Box>
            <Box
                color='gray.500'
                fontWeight='semibold'
                letterSpacing='wide'
                fontSize='xs'
                ml='2'
                mt='2'
            >
                Status: {props.strategy.status == 0 ? 'Draft' : 'Active'}
            </Box>
            {props.strategy.status === 1 &&
                <Box color='gray.500'
                fontWeight='semibold'
                letterSpacing='wide'
                fontSize='xs'
                ml='2'
                mt='2'>
                    Elo: {props.strategy.elo}
            </Box>}
        </VStack>
    )
}
function RadioCard(props) {
    const { getInputProps, getCheckboxProps } = useRadio(props)

    const input = getInputProps()
    const checkbox = getCheckboxProps()

    return (
        <Box as='label'>
            <input {...input} />
            <Box
                {...checkbox}
                cursor='pointer'
                borderWidth='1px'
                borderRadius='md'
                boxShadow='md'
                _checked={{
                    bg: 'teal.600',
                    color: 'white',
                    borderColor: 'teal.600',
                }}
                _focus={{
                    boxShadow: 'outline',
                }}
                px={5}
                py={3}
            >
                <Center>{props.children}</Center>
            </Box>
        </Box>
    )
}
export default ModalAi
