import { EditIcon } from '@chakra-ui/icons'
import {
    Popover,
    PopoverTrigger,
    IconButton,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    useDisclosure,
    Button,
    Heading,
    HStack,
    useToast,
} from '@chakra-ui/react'
import FocusLock from 'react-focus-lock'
import React from 'react'
import { AVAStore } from './../data/DataStore'
import Form from './Form'
import { SubmitErrorHandler, SubmitHandler } from 'react-hook-form'
import FormTextBox from './FormTextBox'

interface EditDraftNameProps {
    name: string,
    setName: (a: string) => (void)
}
const EditDraftName = (props: EditDraftNameProps) => {
    const { onOpen, onClose, isOpen } = useDisclosure()
    const fullName = props.name

    return (
        <HStack>
            <Heading>{fullName}</Heading>
            <Popover
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                placement='right'
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
                        {isOpen && <EditDraftNameForm name={name} setName={props.setName} onCancel={onClose} />}
                    </FocusLock>
                </PopoverContent>
            </Popover>
        </HStack>
    )
}

interface IEditDraftNameForm {
    draftName: string
}

const EditDraftNameForm = ({ onCancel, setName, name }) => {
    const onSubmit: SubmitHandler<IEditDraftNameForm> = async (data) => {
        setName(data.draftName)
    }

    const onError: SubmitErrorHandler<IEditDraftNameForm> = (err, e) => console.error({ err, e })

    return (
        <Form onFormSubmit={onSubmit} onFormError={onError}>
            <FormTextBox
                name='draftName'
                label='Draft Name'
                inputProps={{
                    defaultValue: name,
                    placeholder: 'Ex: Draft #1',
                }}
                validationProps={{
                    required: 'Draft name is required.',
                }}
            />
            <HStack mt='4'>
                <Button variant='outline' onClick={onCancel}>
                    Cancel
                </Button>
                <Button mt='24px' type='submit'>
                    Change name
                </Button>
            </HStack>
        </Form>
    )
}

export default EditDraftName
