import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Tabs, TabList, Tab, TabPanels, TabPanel, ModalFooter, Button, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAVAFetch from '../../helpers/useAVAFetch'
import { Strategy } from '../../models/strategy'

interface DeleteModalProps {
    isOpen: boolean
    strategy?: Strategy
    onOpen: () => void
    onClose: () => void
}
const DeleteModal = (props: DeleteModalProps) => {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = props
    const { isLoading, error, execute } = useAVAFetch(
        '/Strategy/Delete',
        { method: 'PUT' },
        { manual: true },
    )
    const toast = useToast()
    const handleSubmit = async () => {
        if (props.strategy !== undefined) {
            const response = await execute({ url: '/Strategy/Delete/' + props.strategy?.id })
            if (response.status == 200) {
                toast({
                    title: 'Strategy Successfully Deleted',
                    description: `${props.strategy.name} was deleted successfully`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            }
            navigate('/')
        }
    }
        return(
            <Modal isOpen={isOpen} onClose={onClose} size={'md'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Deletion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you would like to delete Strategy: {props.strategy?.name}?
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button colorScheme='red' onClick={handleSubmit}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>)
}
export default DeleteModal