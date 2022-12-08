import React, { useEffect, useState } from 'react'
import { Stat, StatLabel, StatNumber, StatHelpText, Center, Box, Switch, Text, Flex, Spacer, Heading, Button, VStack, HStack, Avatar, Badge, Stack, Input, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, GridItem, Grid, IconButton, Divider, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from '@chakra-ui/react'
import ModalAi from './ModalAi'
import { Link, useNavigate } from 'react-router-dom'
import useAVAFetch from '../helpers/useAVAFetch'
import { ChevronRightIcon, HamburgerIcon } from '@chakra-ui/icons'
import { TbBook2 } from 'react-icons/tb'
import { StrategyStatus } from '../models/strategy-status'
import { randomColor } from '@chakra-ui/theme-tools'
import { ResultType } from '../models/result-type'
import moment from 'moment'
import Moment from 'react-moment'
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
    const daily = useAVAFetch(
        '/Interactions/DailyStats',
        { method: 'GET' },
    ).data
    const selectNavigation = async (r) => {
        if (r.type == ResultType.User) navigate(`/Profile/${r.id}/View`)
        else if (r.type == ResultType.Strategy || r.type == ResultType.Battle) navigate(`/Strategy/${r.id}/Stats`)
        else navigate('/Invalid')
    }
    console.log(data)
    return (
        <Box>
            <Box>
                <VStack my='2'>
                    <HStack w='50vw'>
                        <ModalAi overwrite={false} />
                        <Spacer/>
                        <Heading as='h2' size='xl'>
                            Feed
                        </Heading> 
                        <Popover placement='right' matchWidth={true} size='sm' offset={[25, 6]}>
                        <PopoverTrigger>
                        <IconButton icon={<HamburgerIcon />} aria-label='filters' />
                        </PopoverTrigger>
                        <PopoverContent>
                                <PopoverBody>
                                    <VStack>
                                        <Box display={'inherit'} gap='2'>
                                        <Text>Created Users</Text>
                                        <Switch defaultChecked onChange={() => setShowFilters([!showFilters[0], showFilters[1], showFilters[2]])}/>

                                        </Box>
                                        <Box display={'inherit'} gap='2'>
                                        <Text>Created Drafts</Text>
                                        <Switch defaultChecked onChange={() => setShowFilters([showFilters[0], !showFilters[1], showFilters[2]])}/>

                                        </Box>
                                        <Box display={'inherit'} gap='2'>
                                        <Text>Activated Strategies</Text>
                                        <Switch defaultChecked onChange={() => setShowFilters([showFilters[0], showFilters[1], !showFilters[2]])}/>
                                        </Box>
                                        </VStack>
                            </PopoverBody>
                        </PopoverContent>
                        </Popover>
                        <Spacer/>
                        <Box mt='1'>
                            <Link to='/ManualPlay'> Manual Play </Link> 
                            </Box>
                    </HStack>
                    <Flex w={'50vw'}>
                           <Stat>
                            <StatLabel>New Users</StatLabel>
                            <StatNumber>{daily == undefined ? 0 : daily[0]}</StatNumber>
                            <StatHelpText>Since {moment().add(-1, 'day').format('h:mm a, MM/DD')} </StatHelpText>
                            </Stat>
                        <Spacer />   
                        <Stat>
                            <StatLabel>New Drafts</StatLabel>
                            <StatNumber>{daily == undefined ? 0 : daily[1]}</StatNumber>
                            <StatHelpText>Since {moment().add(-1, 'day').format('h:mm a, MM/DD')} </StatHelpText>
                            </Stat> 
                        <Spacer />
                        <Stat>
                            <StatLabel>New Activations</StatLabel>
                            <StatNumber>{daily == undefined ? 0 : daily[2]}</StatNumber>
                            <StatHelpText>Since {moment().add(-1, 'day').format('h:mm a, MM/DD')} </StatHelpText>
                            </Stat>
                            </Flex>
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
                                        <Badge mr='2' variant='outline' colorScheme='cyan'>
                                            Draft Strategy
                                        </Badge>
                                    )}
                                    {item.type == 2 && (
                                        <Badge mr='2' variant='solid' colorScheme='cyan'>
                                            Active Strategy
                                        </Badge>
                                    )}
                                    {item.type == 0 && (
                                        <Badge mr='2' variant='solid' colorScheme='cyan'>
                                            Created User
                                        </Badge>
                                        )}
                                       {moment(item.time, 'YYYY-MM-DDThh:mm:ss').add(-5, 'hour').fromNow()}
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
