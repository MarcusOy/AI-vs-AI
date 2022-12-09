import React, { useState } from 'react'
import { Stat, StatLabel, StatNumber, StatHelpText, Box, Switch, Text, Flex, Spacer, Heading, Button, VStack, HStack, Avatar, Badge, Stack, IconButton, Popover, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react'
import ModalAi from './ModalAi'
import { Link, useNavigate } from 'react-router-dom'
import useAVAFetch from '../helpers/useAVAFetch'
import { ChevronRightIcon, HamburgerIcon } from '@chakra-ui/icons'
import { TbBook2 } from 'react-icons/tb'
import { randomColor } from '@chakra-ui/theme-tools'
import { ResultType } from '../models/result-type'
import moment from 'moment'
import { InteractionType } from '../models/interaction-type'
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
                                            <Switch defaultChecked onChange={() => setShowFilters([!showFilters[InteractionType.User],
                                            showFilters[InteractionType.CreatedStrategy], showFilters[InteractionType.SubmittedStrategy]])} />

                                        </Box>
                                        <Box display={'inherit'} gap='2'>
                                        <Text>Created Drafts</Text>
                                            <Switch defaultChecked onChange={() => setShowFilters([showFilters[InteractionType.User],
                                            !showFilters[InteractionType.CreatedStrategy], showFilters[InteractionType.SubmittedStrategy]])} />

                                        </Box>
                                        <Box display={'inherit'} gap='2'>
                                        <Text>Activated Strategies</Text>
                                            <Switch defaultChecked onChange={() => setShowFilters([showFilters[InteractionType.User],
                                            showFilters[InteractionType.CreatedStrategy], !showFilters[InteractionType.SubmittedStrategy]])} />
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
                            <StatNumber>{daily == undefined ? 0 : daily[InteractionType.User]}</StatNumber>
                            <StatHelpText>Since {moment().add(-1, 'day').format('h:mm a, MM/DD')} </StatHelpText>
                            </Stat>
                        <Spacer />   
                        <Stat>
                            <StatLabel>New Drafts</StatLabel>
                            <StatNumber>{daily == undefined ? 0 : daily[InteractionType.CreatedStrategy]}</StatNumber>
                            <StatHelpText>Since {moment().add(-1, 'day').format('h:mm a, MM/DD')} </StatHelpText>
                            </Stat> 
                        <Spacer />
                        <Stat>
                            <StatLabel>New Activations</StatLabel>
                            <StatNumber>{daily == undefined ? 0 : daily[InteractionType.SubmittedStrategy]}</StatNumber>
                            <StatHelpText>Since {moment().add(-1, 'day').format('h:mm a, MM/DD')} </StatHelpText>
                            </Stat>
                            </Flex>
                {data?.filter(function (item) {
                    if (!(showFilters[InteractionType.User] && item.type == InteractionType.User)
                        && !(showFilters[InteractionType.CreatedStrategy] && item.type == InteractionType.CreatedStrategy)
                        && !(showFilters[InteractionType.SubmittedStrategy] && item.type == InteractionType.SubmittedStrategy))
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
                                <Avatar bg={randomColor({ string: item.title })} icon={(item.type !== InteractionType.User && <TbBook2 size='25' />) || undefined}
                                    name={item.type == InteractionType.User && item.title || undefined} />
                            <Stack spacing='0.2rem' textAlign='left' ml={5}>
                                <Text>{item.title}</Text>
                                <Text fontSize='xs'>
                                    <span style={{ marginRight: 10 }}> </span>
                                    {item.type == InteractionType.CreatedStrategy && (
                                        <Badge mr='2' variant='outline' colorScheme='cyan'>
                                            Draft Strategy
                                        </Badge>
                                    )}
                                    {item.type == InteractionType.SubmittedStrategy && (
                                        <Badge mr='2' variant='solid' colorScheme='cyan'>
                                            Active Strategy
                                        </Badge>
                                    )}
                                    {item.type == InteractionType.User && (
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
