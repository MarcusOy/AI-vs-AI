import React from 'react'
import { useNavigate } from 'react-router-dom'
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

const ProfileBattlesTab = () => {
    const navigate = useNavigate()

    return (
        <Stack>
            <Box maxW='32rem'>
                <Menu>
                    <MenuButton as={Button}>Open Most Recent Battles</MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => navigate('/Profile')}>Battle 1</MenuItem>
                        <MenuDivider />
                        <MenuItem onClick={() => navigate('/Profile')}>Battle 2</MenuItem>
                        <MenuDivider />
                        <MenuItem onClick={() => navigate('/Profile')}>Battle 3</MenuItem>
                        <MenuDivider />
                        <MenuItem onClick={() => navigate('/Profile')}>Battle 4</MenuItem>
                        <MenuDivider />
                        <MenuItem onClick={() => navigate('/Profile')}>Battle 5</MenuItem>
                    </MenuList>
                </Menu>
            </Box>
        </Stack>
    )
}

export default ProfileBattlesTab
