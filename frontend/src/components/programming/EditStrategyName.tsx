import {
    useDisclosure,
    HStack,
    Editable,
    EditablePreview,
    EditableInput,
    Spinner,
    useToast,
} from '@chakra-ui/react'
import React from 'react'
import useAVAFetch from '../../helpers/useAVAFetch'
import { Strategy } from '../../models/strategy'

interface EditDraftNameProps {
    strategy: Strategy
    onNameChange: (newName: string) => void
}
const EditStrategyName = (p: EditDraftNameProps) => {
    const toast = useToast()
    const { data, isLoading, execute } = useAVAFetch(
        '/Strategy/Update',
        { method: 'PUT' },
        { manual: true },
    )

    const onSubmit = async (newName: string) => {
        if (newName == p.strategy.name) return

        try {
            const newStrategy: Strategy = {
                ...p.strategy,
                name: newName,
            }
            await execute({ data: newStrategy })
            p.onNameChange(newName)
        } catch {
            toast({
                title: 'Could not change strategy name.',
                description: 'Strategy name could not be changed. Please try again later.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    return (
        <HStack>
            <Editable
                defaultValue={p.strategy.name}
                fontWeight='bold'
                fontSize='xl'
                onSubmit={onSubmit}
            >
                <EditablePreview />
                <EditableInput />
            </Editable>
            {isLoading && <Spinner />}
        </HStack>
    )
}

export default EditStrategyName
