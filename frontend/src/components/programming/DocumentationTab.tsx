import { SearchIcon } from '@chakra-ui/icons'
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Heading,
    Highlight,
    Input,
    InputGroup,
    InputLeftElement,
    ListItem,
    Spinner,
    Stack,
    Text,
    Tooltip,
    UnorderedList,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import useAVAFetch from '../../helpers/useAVAFetch'
import useDebounce from '../../hooks/useDebounce'
import { GameStarterCode } from '../../models/game-starter-code'
import { ProgrammingLanguage } from '../../models/programming-language'
import { Strategy } from '../../models/strategy'
import { CodeBlock, vs2015 } from 'react-code-blocks'

interface IDocumentationTabProps {
    strategy: Strategy
}

const DocumentationTab = (p: IDocumentationTabProps) => {
    const [searchQuery, setSearchQuery] = useState('')
    const debounced = useDebounce(searchQuery, 200)
    const handleSearchChange = (e) => setSearchQuery(e.target.value)

    const monacoLanguage =
        p.strategy.language == ProgrammingLanguage.JavaScript ? 'javascript' : 'typescript'

    const { data, isLoading, execute } = useAVAFetch(
        `/StarterCode/${p.strategy.gameId}/${monacoLanguage}`,
    )

    if (data == undefined || isLoading) return <Spinner />

    const docs = (data as GameStarterCode).documentation ?? []
    const filteredDocs =
        debounced != '' ? docs.filter((d) => d.name?.indexOf(debounced) != -1) : docs

    return (
        <Stack spacing={7}>
            <Heading fontSize='lg'>Documentation</Heading>
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <SearchIcon color='gray.300' />
                </InputLeftElement>
                <Input value={searchQuery} onChange={handleSearchChange} placeholder='Search...' />
            </InputGroup>
            {filteredDocs.map((d, i) => {
                return (
                    <Stack key={i}>
                        <Heading fontSize='md'>
                            <Highlight
                                query={debounced}
                                styles={{ px: '1', py: '1', bg: 'orange.100' }}
                            >
                                {d.name!}
                            </Highlight>
                        </Heading>
                        <Text>{d.description}</Text>
                        <Heading fontSize='sm'>Parameters</Heading>
                        {d.parameters && d.parameters.length > 0 ? (
                            <UnorderedList>
                                {d.parameters.map((p, i) => {
                                    return (
                                        <ListItem cursor='help' ml='1rem' key={i}>
                                            <Tooltip
                                                placement='bottom-start'
                                                label={p.description ?? ''}
                                            >
                                                <Text fontSize='sm'>
                                                    {p.name && p.name != '' && `arg${i + 1}`}:{' '}
                                                    <Text as='span' color='cyan.300'>
                                                        {p.type}
                                                    </Text>
                                                </Text>
                                            </Tooltip>
                                        </ListItem>
                                    )
                                })}
                            </UnorderedList>
                        ) : (
                            <Text fontSize='sm'>None</Text>
                        )}

                        <Tooltip
                            placement='bottom-start'
                            label={d.return && d.return.description ? d.return.description : ''}
                        >
                            <Text fontSize='sm' fontWeight='bold'>
                                Returns{' '}
                                <Text as='span' color='cyan.300' fontWeight='normal'>
                                    {d.return && d.return.type ? d.return.type : 'None'}
                                </Text>
                            </Text>
                        </Tooltip>

                        <Accordion allowToggle>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box flex='1' textAlign='left'>
                                            View implementation
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} px={0}>
                                    <CodeBlock
                                        customStyle={{
                                            overflow: 'scroll',
                                        }}
                                        codeContainerStyle={{
                                            fontFamily: 'revert',
                                            minWidth: 0,
                                        }}
                                        text={d.body}
                                        language='typescript'
                                        showLineNumbers
                                        theme={vs2015}
                                    />
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </Stack>
                )
            })}
        </Stack>
    )
}

export default DocumentationTab
