import React from 'react'
import {
    Button,
    Code,
    IconButton,
    Modal,
    Center,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react'
import { AddIcon, ViewIcon } from '@chakra-ui/icons'
interface CodeView {
    codeName?: string
    code: string
    color?: string
}
const CodeView = (props: CodeView) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Button
                as={Button}
                color={props.color || 'gray'}
                onClick={onOpen}
                icon={<ViewIcon />}
                aria-label={'View Code'}
            >
                View Source Code
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} size='full' scrollBehavior='inside'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{props.codeName}</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Center>
                            <Code colorScheme={'gray'}>
                                <pre>{props.code}</pre>
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
        </>
    )
}

export default CodeView
