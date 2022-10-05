import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Button,
    Heading,
    ButtonGroup,
    Stack,
    Avatar,
    Text,
    HStack,
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
} from '@chakra-ui/react'
import { AVAStore } from '../data/DataStore'
import IdentityService from '../data/IdentityService'
import useAVAFetch from '../helpers/useAVAFetch'
import EditFullName from '../components/EditFullName'

const ProfilePage = () => {
    const toast = useToast()
    const navigate = useNavigate()
    const { isLoading, error, execute } = useAVAFetch(
        '/Account',
        { method: 'DELETE' },
        { manual: true }, // makes sure this request fires on user action
    )
    const onDelete = async () => {
        const response = await execute()
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
    const { whoAmI } = AVAStore.useState()
    const fullName = `${whoAmI?.firstName} ${whoAmI?.lastName}`

    return (
        <Box mx='100'>
            <HStack>
                <Avatar size='xl' name={fullName} />
                <Stack spacing='0'>
                    <EditFullName />
                    <Text fontSize='lg' mt={0}>
                        @{whoAmI?.username}
                    </Text>
                </Stack>
            </HStack>
            <Heading size='md' paddingTop={10}>
                Other profile settings here
            </Heading>
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
                            <Button isDisabled={isLoading} onClick={onDelete} colorScheme='red'>
                                {isLoading && <Spinner mr={2} size='xs' />} Sure
                            </Button>
                        </ButtonGroup>
                    </PopoverFooter>
                </PopoverContent>
            </Popover>
            {/* <Flex paddingTop={10} minWidth='max-content' alignItems='center' gap='2'>
                <Textarea placeholder='Here are something about me:' />
            </Flex>

            <Flex paddingBottom={10} minWidth='max-content' alignItems='center' gap='2'>
                <Box p='2'>
                    <Heading size='md' paddingTop={10}>
                        AI/Strategy Amount:
                    </Heading>
                </Box>
                <Spacer />
            </Flex> */}
            {/* <Flex minWidth='max-content' alignItems='center' gap='2'>
                    <Box p='2'>
                        <Heading size='md'>Favorite Game:</Heading>
                    </Box>
                    <Select placeholder='Select option' color='green'>
                        <option value='Game 1'>Option 1</option>
                        <option value='Game 2'>Option 2</option>
                        <option value='Game 3'>Option 3</option>
                    </Select>
            </Flex> */}
            {/* <Flex minWidth='max-content' alignItems='center' gap='2'>
                <Box p='2'>
                    <Heading size='md' paddingTop={10}>
                        Username changing:
                    </Heading>
                </Box>
                <Spacer />
                <ButtonGroup gap='2' paddingTop={10}>
                    <Input variant='flushed' placeholder='Enter new username' />
                    <Button colorScheme='green'>Confirm</Button>
                </ButtonGroup>
            </Flex> */}
        </Box>
    )
}

export default ProfilePage
