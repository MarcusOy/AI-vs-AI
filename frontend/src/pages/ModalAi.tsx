import React, { useEffect, useState } from 'react';
import { Box, Button, chakra, Flex, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useRadio, useRadioGroup } from '@chakra-ui/react';
import { AVAStore } from '../data/DataStore'
import useAVAFetch from '../helpers/useAVAFetch'
import { useNavigate } from 'react-router-dom'

const ModalAi = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { whoAmI } = AVAStore.useState();
    const { data } = useAVAFetch('/Games/1');
    console.log(whoAmI)
    const options = data === undefined ? ['1234 Chess'] : data;
    const replacement = {name: 'Free Save'}
    const strategies = whoAmI?.strategies === null ? [replacement, replacement, replacement] : whoAmI?.strategies;
    const handleSubmit = async (value) => {
        if (value.name === 'Free Save') {
            navigate('/Programming')
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