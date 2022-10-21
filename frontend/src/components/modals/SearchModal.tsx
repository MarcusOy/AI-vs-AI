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
    InputGroup,
    InputLeftElement,
    Spinner,
    Stack,
    HStack,
    Avatar,
    Text,
    Box,
} from '@chakra-ui/react'
import useAVAFetch from '../../helpers/useAVAFetch'
import { IModalProps } from './ModalProvider'
import { ArrowForwardIcon, SearchIcon } from '@chakra-ui/icons'
import useDebounce from '../../hooks/useDebounce'
import { Result } from '../../models/result'
import { useNavigate } from 'react-router-dom'

const SearchModal = (p: IModalProps) => {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [searchQuery, setSearchQuery] = useState('')
    const debounced = useDebounce(searchQuery, 500)
    const { data, isLoading, error, execute } = useAVAFetch(
        '/Search',
        { method: 'GET' },
        { manual: true }, // makes sure this request fires on user action
    )
    const handleSearchChange = (e) => setSearchQuery(e.target.value)

    const onNavigate = (route: string) => {
        onClose()
        navigate(route)
    }

    // Let outside ModalProvider open this modal
    useEffect(() => {
        if (p.openNum > 0) onOpen()
    }, [p.openNum])

    // Send search query on debounce
    useEffect(() => {
        if (searchQuery.trim() !== '')
            execute({
                params: { searchQuery },
            })
    }, [debounced])

    const results = data as Result[]

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <SearchIcon color='gray.300' />
                        </InputLeftElement>
                        <Input
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder='Search...'
                        />
                    </InputGroup>
                </ModalHeader>
                <ModalBody pb={6}>
                    {isLoading || error != undefined || results == undefined ? (
                        <Spinner />
                    ) : (
                        <Stack>
                            {results.map((r, i) => {
                                return (
                                    <Button
                                        key={r.id}
                                        py='8'
                                        textAlign='left'
                                        justifyContent='start'
                                        color='chakra-body-text'
                                        variant='ghost'
                                        onClick={() => onNavigate(`/Profile/${r.id}/View`)}
                                    >
                                        <HStack flexGrow={1}>
                                            <Avatar name={r.title} />
                                            <Box flexGrow={1}>
                                                <Text fontSize='xs' color='CaptionText'>
                                                    {r.subtitle}
                                                </Text>
                                                <Text>{r.title}</Text>
                                            </Box>
                                            <ArrowForwardIcon />
                                        </HStack>
                                    </Button>
                                )
                            })}
                        </Stack>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
export default SearchModal
