import React, { useState } from 'react'
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom'
import {
    Center,
    Box,
    Text,
    Flex,
    Spacer,
    FormControl,
    FormLabel,
    Input,
    Button,
    HStack,
    ButtonGroup,
    Tab,
    TabList,
    Tabs,
    Stack,
    Avatar,
    Heading,
    TabPanel,
    TabPanels,
} from '@chakra-ui/react'

import useAVAFetch from '../helpers/useAVAFetch'
import EditFullName from '../components/profile/EditFullName'

const BattlePage = () => {
    const [id, setid] = useState('')
    const { data, isLoading, execute } = useAVAFetch(
        `/Battle/${id}`,
        { method: 'POST' },
        { manual: true }, // makes sure this request fires on user action
    )
    const navigate = useNavigate()

    const handleTabsChange = (index) => {
        const tab =
            index == 1
                ? 'BattleStrat'
                : index == 2
                ? 'Battles'
                : index == 3
                ? 'Submissions'
                : 'View'
        navigate(`/Profile/${id}/${tab}`)
    }

    return <Text>1</Text>
}

export default BattlePage
