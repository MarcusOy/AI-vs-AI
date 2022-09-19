import React, { useState } from 'react'
import Editor from '@monaco-editor/react';
import { Box, Button, Flex, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, VStack } from '@chakra-ui/react'
function Programming() {
    const [code, setCode] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
        <Box>
        <HStack spacing='20%'>
            <Box width='33%' margin='4'>
                <VStack>
                    <Editor
                    height='75vh'
                    defaultLanguage="javascript"
                    defaultValue="// Enter Strategy Here"
                    theme='vs-dark'
                    onChange={(value, e) => setCode(value === undefined ? '' : value)}
                    />
                    <Box>
                        <Button size='lg' colorScheme='cyan' mt='24px' onClick={() => {console.log(code)}}>
                            Save Draft
                        </Button>
                    </Box>
                </VStack>
            </Box>
            <Box marginTop='5'>
                <VStack>
                    <img src='/10x10 chess board.png' className='App-logo' alt='logo'/>
                    <Box>
                        <Button size='lg' colorScheme='cyan' mt='24px' variant='outline' onClick={onOpen}>
                            View Game Rules
                        </Button>
                    </Box>
                </VStack>
            </Box>
      </HStack>
      </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Game Rules</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <p>Wow it opened</p>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
        </>
      )
}
export default Programming