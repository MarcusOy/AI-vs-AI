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
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAVAFetch from '../helpers/useAVAFetch'
import { randomColor } from '@chakra-ui/theme-tools'

const UnrankedResult = () => {
    const navigate = useNavigate()
    const { id1, id2 } = useParams()

    const { data, isLoading, error, execute } = useAVAFetch(`/UnrankedGameResult/${id1}/${id2}`)
    console.log(data)
    if (isLoading || error) return <Spinner />

    return <Heading>This is the result of a unranked battle</Heading>
}

export default UnrankedResult
