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
    Stack,
} from '@chakra-ui/react'
import { AddIcon, ViewIcon } from '@chakra-ui/icons'
import CodeView from '../CodeView'
import useAVAFetch from '../../helpers/useAVAFetch'
import { Link, useParams } from 'react-router-dom'
import { Strategy } from '../../models/strategy'
import { User } from '../../models/user'
import { AVAStore } from '../../data/DataStore'

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
    const { whoAmI } = AVAStore.useState()
    const [select, setSelect] = useState(false)
    const { id } = useParams()
    const sourceCode = p.strategy.sourceCode
    const strategy = useAVAFetch('/getAi/' + id).data
    const isSelf = p.strategy.createdByUserId ==whoAmI?.id
    const deleteRequest = useAVAFetch(
        '/Account',
        { method: 'DELETE' },
        { manual: true }, // makes sure this request fires on user action
    )

    return (
        <Box>
            <Stack mt='5'>
                {!isSelf ? (<>{p.strategy.isPrivate  ? (<Center>
                        <Code colorScheme={'gray'}>
                            <pre>{sourceCode}</pre>
                        </Code>
                    </Center> ): <>set as private</>}</>): (<><Center>
                        <Code colorScheme={'gray'}>
                            <pre>{sourceCode}</pre>
                        </Code>
                    </Center></>)}
                
            </Stack>
        </Box>
    )
}




export default StrategySourceCodeTab