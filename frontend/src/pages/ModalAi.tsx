import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { AVAStore } from '../data/DataStore'

const ModalAi = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { whoAmI } = AVAStore.useState();

    return (
      <>
        <Button onClick={onOpen}>Draft AI</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select a Draft Save</ModalHeader>
            <ModalCloseButton />
            <ModalBody>

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