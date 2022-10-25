import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
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
} from '@chakra-ui/react'
import { AVAStore } from '../data/DataStore'
import useAVAFetch from '../helpers/useAVAFetch'
import { useNavigate } from 'react-router-dom'
import { Strategy } from '../models/strategy'
import { StrategyStatus } from '../models/strategy-status'
import IdentityService from '../data/IdentityService'
import { devComplete, helperFunctions } from '../helpers/hardcodeAi'
import { Game } from '../models/game'

const ModalAi = () => {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { whoAmI } = AVAStore.useState()
    const { data } = useAVAFetch('/Games/')
    const { isLoading, error, execute } = useAVAFetch(
        '/Strategy',
        { method: 'PUT' },
        { manual: true },
    )

    const options = data === undefined ? [{name: '1234 Chess', id: 1}] : data
    const replacement = { name: 'Free Save' }
    const openStrats = [replacement, replacement, replacement];
    const strategies = whoAmI?.strategies || []
    const handleSubmit = async (value) => {
        if (value.name === 'Free Save' && whoAmI !== undefined) {
            const build: Strategy = {
                gameId: 1,
                name: 'Untitled Draft',
                sourceCode: helperFunctions + devComplete,
            }
            const response = await execute({ data: build })
            console.log(response)
            IdentityService.refreshIdentity()
            navigate('/Programming/' + response.data.id)
        } else {
            navigate('/Programming/' + value.id)
        }
    }
    const findDrafts = (game: Game) => {
        let count = 0;
        return (<HStack m={4}>
            {strategies?.map((value, key) => {
                if (value.gameId == game.id) {
                    count++;
                    return (
                        <Button
                            key={key}
                            type='submit'
                            onClick={() => handleSubmit(value)}
                        >
                            {value.name}
                        </Button>
                    )
                }
        })}
        {openStrats.map((value, key) => {
            if (count + key < 3) {
                return (
                    <Button
                        key={key}
                        type='submit'
                        onClick={() => handleSubmit(value)}
                    >
                        {'Free Save #' + (key+1)}
                    </Button>
                )
            }
        })

        }
    </HStack>)
    }
    return (
        <>
            <Button onClick={onOpen}>Draft AI</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Select a Draft Save</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <Tabs variant='enclosed'>
                        <TabList>
                                {options?.map((value, key) => {
                                    return <Tab key={key} isDisabled={value.id !== 1}>{value.name}</Tab>
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
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost'>Select</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalAi
