import React, { useEffect, useState } from 'react'
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
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
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
} from '@chakra-ui/react'
import { randomColor } from '@chakra-ui/theme-tools'
import useAVAFetch from '../../helpers/useAVAFetch'
import { IModalProps } from './ModalProvider'
import { ArrowForwardIcon, SearchIcon } from '@chakra-ui/icons'
import useDebounce from '../../hooks/useDebounce'
import { Result } from '../../models/result'
import { useNavigate } from 'react-router-dom'
import { ResultType } from '../../models/result-type'
import { TbBook2, TbSwords } from 'react-icons/tb'

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

    const onNavigate = (r: Result) => {
        onClose()

        if (r.type == ResultType.User) navigate(`/Profile/${r.id}/View`)
        else if (r.type == ResultType.Strategy) navigate(`/Strategy/${r.id}/Stats`)
        else if (r.type == ResultType.Battle) navigate(`/Battle/${r.id}`)
        else navigate('/Invalid')
    }

    // Let outside ModalProvider open this modal
    useEffect(() => {
        if (p.openNum > 0) onOpen()
    }, [p.openNum])

    // Send search query on debounce
    useEffect(() => {
        if (searchQuery !== '')
            execute({
                params: { searchQuery: searchQuery.trim() },
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
                    {error != undefined && (
                        <Alert status='error'>
                            <AlertIcon />
                            <AlertTitle>Error.</AlertTitle>
                            <AlertDescription>{error?.response?.data}</AlertDescription>
                        </Alert>
                    )}
                    {data == undefined ? (
                        <Text>Enter a search query above.</Text>
                    ) : results.length <= 0 ? (
                        <Text>No results found for this query.</Text>
                    ) : isLoading ? (
                        <Spinner />
                    ) : (
                        <Stack>
                            {error == undefined &&
                                results.map((r, i) => {
                                    return (
                                        <Button
                                            key={r.id}
                                            py='8'
                                            textAlign='left'
                                            justifyContent='start'
                                            color='chakra-body-text'
                                            variant='ghost'
                                            onClick={() => onNavigate(r)}
                                        >
                                            <HStack flexGrow={1}>
                                                {r.type == ResultType.User ? (
                                                    <Avatar name={r.title} />
                                                ) : r.type == ResultType.Battle ? (
                                                    <Avatar
                                                        bg={randomColor({ string: r.title })}
                                                        icon={<TbSwords size='25' />}
                                                    />
                                                ) : (
                                                    <Avatar
                                                        bg={randomColor({ string: r.title })}
                                                        icon={<TbBook2 size='30' />}
                                                    />
                                                )}
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
