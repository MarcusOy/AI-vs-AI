import { EditIcon } from '@chakra-ui/icons'
import {
    Box,
    Popover,
    PopoverTrigger,
    IconButton,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    useDisclosure,
    Button,
    ButtonGroup,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Heading,
    HStack,
    useToast,
    Spinner,
} from '@chakra-ui/react'
import FocusLock from 'react-focus-lock'
import React from 'react'
import { AVAStore } from '../../data/DataStore'
import Form from '../Form'
import { SubmitErrorHandler, SubmitHandler } from 'react-hook-form'
import FormTextBox from '../FormTextBox'
import useAVAFetch from '../../helpers/useAVAFetch'
import { User } from '../../models/user'
import IdentityService from '../../data/IdentityService'

const EditFullName = () => {
    const { onOpen, onClose, isOpen } = useDisclosure()
    const { whoAmI } = AVAStore.useState()
    const fullName = `${whoAmI?.firstName} ${whoAmI?.lastName}`

    return (
        <HStack>
            <Heading>{fullName}</Heading>
            <Popover
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                placement='right-start'
                closeOnBlur={false}
            >
                <PopoverTrigger>
                    <IconButton
                        size='sm'
                        colorScheme='gray'
                        icon={<EditIcon />}
                        aria-label={'Edit full name'}
                    />
                </PopoverTrigger>
                <PopoverContent p={5}>
                    <FocusLock returnFocus persistentFocus={false}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        {isOpen && <EditFullNameForm onCancel={onClose} />}
                    </FocusLock>
                </PopoverContent>
            </Popover>
        </HStack>
    )
}

interface IEditNameForm {
    firstName: string
    lastName: string
}

const EditFullNameForm = ({ onCancel }) => {
    const toast = useToast()
    const { whoAmI } = AVAStore.useState()
    const { isLoading, error, execute } = useAVAFetch(
        '/Account',
        { method: 'POST' },
        { manual: true }, // makes sure this request fires on user action
    )

    const onSubmit: SubmitHandler<IEditNameForm> = async (data) => {
        const newUser: User = {
            ...(whoAmI as User),
            firstName: data.firstName,
            lastName: data.lastName,
        }
        const response = await execute({ data: newUser })
        if (response.status == 200) {
            IdentityService.refreshIdentity()
            toast({
                title: 'Name changed Successful.',
                description: 'You just changed your full name.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            onCancel()
        }
    }

    const onError: SubmitErrorHandler<IEditNameForm> = (err, e) => console.error({ err, e })

    return (
        <Form onFormSubmit={onSubmit} onFormError={onError}>
            <FormTextBox
                name='firstName'
                label='First Name'
                inputProps={{
                    defaultValue: whoAmI?.firstName,
                    placeholder: 'Ex: John',
                }}
                validationProps={{
                    required: 'First name is required.',
                }}
            />
            <FormTextBox
                name='lastName'
                label='Last Name'
                inputProps={{ defaultValue: whoAmI?.lastName, placeholder: 'Ex: Doe' }}
                validationProps={{
                    required: 'Last name is required.',
                }}
            />
            <HStack mt='4'>
                <Button variant='outline' onClick={onCancel}>
                    Cancel
                </Button>
                <Button isDisabled={isLoading} mt='24px' type='submit'>
                    {isLoading && <Spinner mr={2} size='xs' />}Change name
                </Button>
            </HStack>
        </Form>
    )
}

export default EditFullName
