import React, { useEffect, useState } from 'react'
import { Center, Box, Text, Flex, Spacer, Heading, Button, VStack, HStack, Avatar, Badge, Stack, Input, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from '@chakra-ui/react'
import ModalAi from './ModalAi'
import { Link, useNavigate } from 'react-router-dom'
import useAVAFetch from '../helpers/useAVAFetch'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { TbBook2 } from 'react-icons/tb'
import { StrategyStatus } from '../models/strategy-status'
import { randomColor } from '@chakra-ui/theme-tools'
import { ResultType } from '../models/result-type'
interface Interactions {
    type: number
    title: string
    sourceCode?: string
    id: string
    createdByGuid: string
    createdByName: string
    time: string
}
const FeedPage = () => {
    const navigate = useNavigate()
    const [showFilters, setShowFilters] = useState([false, false, false]);
    const { isLoading, error, execute, data } = useAVAFetch(
        '/Interactions/',
        { method: 'GET' },
    )
    const selectNavigation = async (r) => {
        if (r.type == ResultType.User) navigate(`/Profile/${r.id}/View`)
        else if (r.type == ResultType.Strategy || r.type == ResultType.Battle) navigate(`/Strategy/${r.id}/Stats`)
        else navigate('/Invalid')
    }
    console.log(data);
    let numberNewUser = 0;
    if (data != null) {
        for (let i = 0; i < data.length; i++) {
            const time = new Date().getTime() - new Date(data[i].time).getTime()
            const days = Math.floor(time / (24 * 60 * 60 * 1000));
            if (days == 0) {
                numberNewUser = numberNewUser + 1;
            }
        }    
    }
    
    return (
        <Box>
            <Box>
            <HStack spacing={'39vw'} width='100%'>
            <Box>
                <ModalAi overwrite={false} />
            </Box>
            <Box>
                <Text>Feed page</Text>
                        <Link to='/ManualPlay'> Manual Play </Link>
                        <Box><>Number new User: {numberNewUser}</>   </Box>      
            </Box>
                </HStack>
            </Box>
            <Box>
                <VStack my='2'>
                    <Box border={'1px'} borderColor='light-gray' w='50vw' display={'flex'} alignContent='center'>
                     <Accordion allowToggle w={'50vw'}>
                                <AccordionItem >
                                    <h2>
                                        <AccordionButton>
                                            <Box flex='1' textAlign='left'>
                                                Filters
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        <Box  marginY='4' justifyContent='center'>
                                        <Button mx='2' onClick={() => setShowFilters([!showFilters[0], showFilters[1], showFilters[2]])}>
                                            {!showFilters[0] ? 'Hide Created Users' : 'Show Created Users'}</Button>
                                        <Button mx='2' onClick={() => setShowFilters([showFilters[0], !showFilters[1], showFilters[2]])}>
                                            {!showFilters[1] ? 'Hide Created Drafts' : 'Show Created Drafts'}</Button>
                                        <Button onClick={() => setShowFilters([showFilters[0], showFilters[1], !showFilters[2]])}>
                                            {!showFilters[2] ? 'Hide Activated Strategies' : 'Show Activated Strategies'}</Button>
                                        </Box>
                                    </AccordionPanel>
                                </AccordionItem>
                        </Accordion>

                    </Box>
                {data?.filter(function (item) {
                    if (!(showFilters[0] && item.type == 0)
                        && !(showFilters[1] && item.type == 1)
                        && !(showFilters[2] && item.type == 2))
                        return item
                }).map((item, index) => {
                    return (
                        <Box  key={index}>
                        <Button
                            colorScheme={'gray'}
                            onClick={() => selectNavigation(item)}
                            rightIcon={<ChevronRightIcon />}
                            p={10}
                            w={'50vw'}
                            h={'10vh'}
                        >
                                <Avatar bg={randomColor({ string: item.title })} icon={(item.type !== 0 && <TbBook2 size='25' />) || undefined}
                                    name={item.type == 0 && item.title || undefined} />
                            <Stack spacing='0.2rem' textAlign='left' ml={5}>
                                <Text>{item.title}</Text>
                                <Text fontSize='xs'>
                                    <span style={{ marginRight: 10 }}> </span>
                                    {item.type == 1 && (
                                        <Badge variant='outline' colorScheme='cyan'>
                                            Draft Strategy
                                        </Badge>
                                    )}
                                    {item.type == 2 && (
                                        <Badge variant='solid' colorScheme='cyan'>
                                            Active Strategy
                                        </Badge>
                                    )}
                                    {item.type == 0 && (
                                        <Badge variant='solid' colorScheme='cyan'>
                                            Created User
                                        </Badge>
                                    )}
                                </Text>
                            </Stack>
                            <Box flexGrow={1} />
                            </Button>
                            </Box>
                    )
                })}
                    </VStack>
                </Box>
        </Box>
    )
}

export default FeedPage
