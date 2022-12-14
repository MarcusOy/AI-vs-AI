import React from 'react';
import { Button, Box, Code, IconButton, Modal, Center, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ModalAi from './ModalAi';
import Copy from '../helpers/Copy';
import { Strategy } from '../models/strategy';
interface CodeModalProps {
    strategy: Strategy
    color?: string
    stock?: boolean
}
const CodeModal = (props: CodeModalProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <IconButton color={props.color || 'gray'} onClick={onOpen} icon={<AddIcon />} aria-label={'View Code'} />
            <Modal isOpen={isOpen} onClose={onClose} size='full' scrollBehavior='inside'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{props.strategy?.name || 'Name Undefined'}</ModalHeader>
                    <ModalCloseButton />
                    
                    <ModalBody>
                        <Box overflowX='scroll'>
                            <Code colorScheme={'gray'}>
                                <pre>
                                    {props.strategy.sourceCode}
                                </pre>
                            </Code> 
                        </Box>
                    </ModalBody>
            
                    <ModalFooter p='2'>
                        {!props.stock &&
                            <>
                        <ModalAi overwrite={true} strategy={props.strategy} />
                        <Center ml='4'>
                            <Copy sourceCode={props.strategy.sourceCode} />
                            </Center>
                            </>
                        }
                        <Center ml='4'>
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