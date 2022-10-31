import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AVAStore } from '../../data/DataStore'
import IdentityService from '../../data/IdentityService'
import useAVAFetch from '../../helpers/useAVAFetch'

import {
    Center,
    Box,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Stack,
    MenuDivider,
} from '@chakra-ui/react'

const ProfileStrategiesTab = () => {
    const { whoAmI } = AVAStore.useState()

    const { id, tab } = useParams()
    const isSelf = id == whoAmI?.id

    const navigate = useNavigate()

    const { data, error, isLoading } = useAVAFetch(
        `/Account/${id}`,
        {},
        { manual: isSelf }, // don't retrieve account if self
    )

    return (
        <Stack>
            <Box maxW='32rem'>
                <Button onClick={() => navigate(`/Profile/${id}/StratPage`)}>View Stategy</Button>
            </Box>
        </Stack>
    )
}

export default ProfileStrategiesTab
