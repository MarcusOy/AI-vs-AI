import { ChevronDownIcon } from '@chakra-ui/icons'
import {
    Avatar,
    Box,
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Spinner,
} from '@chakra-ui/react'
import React from 'react'
import { AVAStore } from '../data/DataStore'
import IdentityService from '../data/IdentityService'
import useAVAFetch from '../helpers/useAVAFetch'
import { useNavigate } from 'react-router-dom'

const CurrentAccountButton = () => {
    const navigate = useNavigate()
    const { whoAmI } = AVAStore.useState()
    const { isLoading, error, execute } = useAVAFetch(
        '/Account/Logout',
        { method: 'POST' },
        { manual: true }, // makes sure this request fires on user action
    )

    const onLogout = async () => {
        const response = await execute()
        if (response.status == 200 || response.status == 401) {
            IdentityService.unsetIdentity()
            navigate('/')
        }
    }

    const fullName = `${whoAmI?.firstName} ${whoAmI?.lastName}`

    return (
        <Box>
            <Menu>
                <MenuButton as={Button} colorScheme='gray' rightIcon={<ChevronDownIcon />}>
                    <Avatar size='xs' mr='2' name={fullName} />
                    {fullName}
                </MenuButton>
                <MenuList backgroundColor='chakra-body-bg'>
                    <MenuGroup title='Profile'>
                        <MenuItem onClick={() => navigate('/Profile')}>My Profile</MenuItem>
                        <MenuItem onClick={() => navigate('/Profile/Strategies')}>
                            My Strategies
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/Profile/Battles')}>My Battles</MenuItem>
                        <MenuItem onClick={() => navigate('/Profile/Submissions')}>
                            My Submissions
                        </MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup title='Help'>
                        <MenuItem>Docs</MenuItem>
                        <MenuItem>FAQ</MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuItem
                        isDisabled={isLoading}
                        closeOnSelect={false}
                        onClick={onLogout}
                        color='red'
                    >
                        {isLoading && <Spinner mr={2} size='xs' />} Logout
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    )
}

export default CurrentAccountButton
