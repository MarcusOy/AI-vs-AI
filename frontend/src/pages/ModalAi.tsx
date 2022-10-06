import React, { useEffect, useState } from 'react';
import { Box, Button, chakra, Flex, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useRadio, useRadioGroup } from '@chakra-ui/react';
import { AVAStore } from '../data/DataStore'
import useAVAFetch from '../helpers/useAVAFetch'
import { useNavigate } from 'react-router-dom'
import { Strategy } from '../models/strategy';
import { StrategyStatus } from '../models/strategy-status'

const ModalAi = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { whoAmI } = AVAStore.useState();
    const { data } = useAVAFetch('/Games/1');
    const { isLoading, error, execute } = useAVAFetch(
      '/createStrat',
      { method: 'POST' },
      { manual: true },
    )

    const options = data === undefined ? ['1234 Chess'] : data;
    const replacement = { name: 'Free Save'}
    const strategies = whoAmI?.strategies === null ? [replacement, replacement, replacement] : whoAmI?.strategies;
    const handleSubmit = async (value) => {
      if (value.name === 'Free Save' && whoAmI !== undefined) {
        const build: Strategy = {
          name: 'Untitled Draft',
          sourceCode: data.boilerplateCode,
          createdByUser: whoAmI,
          createdByUserId: whoAmI?.id,
          gameId: 1,
          game: data,
          id: '',
          status: StrategyStatus.Draft,
          version: 0,
          attackerBattles: [],
          defenderBattles: [],
          createdOn: new Date(),
          updatedOn: new Date(),
          deletedOn: new Date()
        }
        const response = await execute({ data: { build } })
        console.log(response)
            navigate('/Programming/' + response)
        }
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
                        <HStack m={4}>
                            {strategies?.map((value, key) => {
                                return (
                                    <Button key={key} type='submit' onClick={() => handleSubmit(value)}>
                                        {value === null ? 'Free Save #' + key: value.name}
                                    </Button>
                                )
                            })}
                        </HStack>  
                    </ModalBody>
  
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                        </Button>
                        <Button variant='ghost'>Select</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>);
}

export default ModalAi