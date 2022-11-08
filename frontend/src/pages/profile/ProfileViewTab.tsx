import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Button,
    Heading,
    ButtonGroup,
    Stack,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverCloseButton,
    PopoverFooter,
    PopoverBody,
    Popover,
    Spinner,
    useToast,
    Textarea,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react'
import IdentityService from '../../data/IdentityService'
import useAVAFetch from '../../helpers/useAVAFetch'
import { User } from '../../models/user'
import EditFavoriteGameDropdown from '../../components/profile/EditFavoriteGameDropdown'
import EditBioTextBox from '../../components/profile/EditBioTextBox'

interface IProfilePage {
    user: User
    isSelf: boolean
}

const ProfilePage = (p: IProfilePage) => {
    const deleteRequest = useAVAFetch(
        '/Account',
        { method: 'DELETE' },
        { manual: true }, // makes sure this request fires on user action
    )
    const changeFavoriteGameRequest = useAVAFetch(
        '/Account',
        { method: 'POST' },
        { manual: true }, // makes sure this request fires on user action
    )
    const toast = useToast()
    const navigate = useNavigate()

    const onDelete = async () => {
        const response = await deleteRequest.execute()
        if (response.status == 200 || response.status == 401) {
            IdentityService.unsetIdentity()
            navigate('/')

            toast({
                title: 'Account deleted.',
                description: 'We are sad to see you leave.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    return (
        <Box>
            <Stack mt='5'>
                {p.isSelf ? (
                    <>
                        <EditBioTextBox />
                        <EditFavoriteGameDropdown />
                    </>
                ) : (
                    <>
                        <FormControl>
                            <FormLabel>Bio</FormLabel>
                            <Textarea isDisabled value={p.user.bio ?? ''} placeholder='No bio.' />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Favorite game</FormLabel>
                            <Input
                                isDisabled
                                value={p.user.favoriteGame?.name}
                                placeholder='No favorite game.'
                            />
                        </FormControl>
                    </>
                )}

                <Heading size='md' paddingTop={10}>
                    ...other profile settings here...
                </Heading>
            </Stack>
            {p.isSelf && (
                <>
                    <Heading size='md' paddingTop={10}>
                        Account Operation:
                    </Heading>
                    <Popover returnFocusOnClose={false} placement='bottom' closeOnBlur={false}>
                        <PopoverTrigger>
                            <Button mt='2' colorScheme='red'>
                                Delete Account
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>Are you sure you want to delete your account?</PopoverBody>
                            <PopoverFooter display='flex' justifyContent='flex-end'>
                                <ButtonGroup size='sm'>
                                    <Button
                                        isDisabled={deleteRequest.isLoading}
                                        onClick={onDelete}
                                        colorScheme='red'
                                    >
                                        {deleteRequest.isLoading && <Spinner mr={2} size='xs' />}{' '}
                                        Sure
                                    </Button>
                                </ButtonGroup>
                            </PopoverFooter>
                        </PopoverContent>
                    </Popover>
                </>
            )}
        </Box>
    )
}

export default ProfilePage
