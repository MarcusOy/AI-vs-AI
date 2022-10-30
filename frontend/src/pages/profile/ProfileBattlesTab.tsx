import React from 'react'
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
    return (
        <Stack>
            <Box maxW='32rem'>
                <Menu>
                    <MenuButton as={Button}>Open Most Recent Battles</MenuButton>
                    <MenuList>
                        <MenuItem>Battle 1</MenuItem>
                        <MenuDivider />
                        <MenuItem>Battle 2</MenuItem>
                        <MenuDivider />
                        <MenuItem>Battle 3</MenuItem>
                        <MenuDivider />
                        <MenuItem>Battle 4</MenuItem>
                        <MenuDivider />
                        <MenuItem>Battle 5</MenuItem>
                    </MenuList>
                </Menu>
            </Box>
        </Stack>
    )
}

export default ProfileBattlesTab
