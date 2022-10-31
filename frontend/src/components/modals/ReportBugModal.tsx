import React, { useEffect, useState } from 'react'
import {
    FormControl,
    FormLabel,
    Button,
    FormErrorMessage,
    FormHelperText,
    Textarea,
    useToast,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react'
import { BugReport } from '../../models/bug-report'
import useAVAFetch from '../../helpers/useAVAFetch'
import { IModalProps } from './ModalProvider'

const SearchModal = (p: IModalProps) => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const [description, setDescription] = useState('')
    const { isLoading, execute } = useAVAFetch(
        '/BugReport',
        { method: 'POST' },
        { manual: true }, // makes sure this request fires on user action
    )
    const handleInputChange = (e) => setDescription(e.target.value)
    const onReportSubmit = async (e) => {
        const newReport: BugReport = {
            regarding: window.location.href,
            description: description,
        }
        const response = await execute({ data: newReport })
        if (response.status == 200) {
            onClose()
            setDescription('')
            toast({
                title: 'Bug report submitted.',
                description: 'Thank you for your feedback.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    // Let outside ModalProvider open this modal
    useEffect(() => {
        if (p.openNum > 0) onOpen()
    }, [p.openNum])

    const isValid = description.length > 0 && description.length < 500 && description.trim() != ''

    return (
        <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Submit Bug Report</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Regarding</FormLabel>
                        <Input isDisabled value={window.location.href} />
                        <FormHelperText>Tell us which page the bug happened on.</FormHelperText>
                    </FormControl>
                    <FormControl isInvalid={!isValid}>
                        <FormLabel>Bio</FormLabel>
                        <Textarea
                            ref={initialRef}
                            value={description}
                            onChange={handleInputChange}
                            placeholder='Enter the detail of the report.'
                            size='lg'
                        />
                        <FormHelperText>Tell us what happened on this page.</FormHelperText>
                        {!isValid && (
                            <FormErrorMessage>
                                Description must be filled and under 500 characters.
                            </FormErrorMessage>
                        )}
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        mr={3}
                        isDisabled={isLoading}
                        isLoading={isLoading}
                        onClick={onReportSubmit}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
export default SearchModal
