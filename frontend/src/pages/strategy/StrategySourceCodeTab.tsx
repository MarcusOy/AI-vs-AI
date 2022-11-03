import React, { useEffect, useRef, useState } from 'react'
import {
    Button,
    Code,
    IconButton,
    Modal,
    Center,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    Box,
} from '@chakra-ui/react'
import { AddIcon, ViewIcon } from '@chakra-ui/icons'
import CodeView from '../CodeView'
import useAVAFetch from '../../helpers/useAVAFetch'
import { Link, useParams } from 'react-router-dom'
import { Strategy } from '../../models/strategy'

import {
    devComplete,
    developerAi,
    easyAi,
    emptyStarter,
    helperFunctions,
} from '../../helpers/hardcodeAi'
interface StrategySourceCodeTab {
    strategy: Strategy
}

const StrategySourceCodeTab = (p: StrategySourceCodeTab) => {
    const [select, setSelect] = useState(false)
    const { id } = useParams()
    const sourceCode = p.strategy.sourceCode
    const strategy = useAVAFetch('/getAi/' + id).data
    return (
        <Box>
            <Center>
                <Code colorScheme={'gray'}>
                    <pre>{sourceCode}</pre>
                </Code>
            </Center>
        </Box>
    )
}

export default StrategySourceCodeTab