import React from 'react'
import {
    Center,
    Box,
    Text,
    Flex,
    Spacer,
    Heading,
    Button,
    HStack,
    Avatar,
    Spinner,
    Stack,
    Highlight,
} from '@chakra-ui/react'
import ModalAi from './ModalAi'
import { Link, useNavigate } from 'react-router-dom'
import useAVAFetch from '../helpers/useAVAFetch'
import { randomColor } from '@chakra-ui/theme-tools'
import { TbBook2 } from 'react-icons/tb'
import { GiTrophyCup } from 'react-icons/gi'
import { BiMedal } from 'react-icons/bi'
import { CiMedal } from 'react-icons/ci'
import { Strategy } from '../models/strategy'
import { ArrowForwardIcon } from '@chakra-ui/icons'

const LeaderBoardPage = () => {
    const navigate = useNavigate()
    const { data, isLoading, error, execute } = useAVAFetch('/Leaderboard/Get/1')
    console.log(data)
    if (isLoading || error) return <Spinner />
    const StratList: Strategy[] = data
    return (
        <Box>
            <Center>
                <Flex>
                    <Heading size='md' fontSize='50px' color='cyan'>
                        Top 10 LeaderBoard For 1234 Chess
                    </Heading>
                </Flex>
            </Center>

            <Box mx='50'>
                <Stack alignItems='center'>
                    {error == undefined &&
                        StratList.map((s, i) => {
                            return (
                                <Button
                                    key={s.id}
                                    py='8'
                                    textAlign='left'
                                    justifyContent='start'
                                    color='chakra-body-text'
                                    variant='ghost'
                                    width='80'
                                    size={i == 0 ? '2xl' : 'lg'}
                                    onClick={() => navigate(`/Strategy/${s.id}/Stats`)}

                                >
                                    <HStack flexGrow={1}>
                                        {i == 0 ? (
                                            <Avatar
                                                bg={'gold'}
                                                icon={<GiTrophyCup size='50' />}
                                                size='2xl'
                                            />
                                        ) : i == 1 ? (
                                            <Avatar
                                                bg={'silver'}
                                                icon={<BiMedal size='40' />}
                                                size='md'
                                            />
                                        ) : i == 2 ? (
                                            <Avatar
                                                bg={'brown'}
                                                icon={<CiMedal size='30' />}
                                                size='md'
                                            />
                                        ) : (
                                            <Avatar
                                                bg={randomColor({ string: s.name })}
                                                icon={<TbBook2 size='25' />}
                                            />
                                        )}

                                        <Box flexGrow={1}>
                                            <Text fontSize='xs' color='CaptionText'>
                                                {s.createdByUser?.username}
                                            </Text>
                                            {/* <Text>{r.title}</Text> */}
                                            {i}. {s.name}
                                        </Box>
                                        <ArrowForwardIcon />
                                    </HStack>
                                </Button>
                            )
                        })}
                </Stack>
            </Box>
        </Box>
    )
}

export default LeaderBoardPage
