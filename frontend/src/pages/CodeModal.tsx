import React from 'react';
import { Button, Code, IconButton, Modal, Center, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
interface CodeModalProps {
    codeName?: string
    code: string
    color?: string
}
const CodeModal = (props: CodeModalProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <IconButton color={props.color || 'gray'} onClick={onOpen} icon={<AddIcon />} aria-label={'View Code'} />
            <Modal isOpen={isOpen} onClose={onClose} size='full' scrollBehavior='inside'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{props.codeName}</ModalHeader>
                    <ModalCloseButton />
                    
                    <ModalBody>
                        <Center>
                            <Code colorScheme={'gray'}>
                                <pre>
                                    {props.code}
                                </pre>
                            </Code> 
                        </Center>
                    </ModalBody>
            
                    <ModalFooter>
                        <Center>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                            </Button>
                        </Center>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>);
}

export default CodeModal