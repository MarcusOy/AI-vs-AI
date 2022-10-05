import React, { useEffect, useState } from 'react'
import {
    Spinner,
    FormControl,
    FormLabel,
    Editable,
    EditablePreview,
    EditableTextarea,
    useToast,
} from '@chakra-ui/react'
import { AVAStore } from '../../data/DataStore'
import IdentityService from '../../data/IdentityService'
import useAVAFetch from '../../helpers/useAVAFetch'
import { User } from '../../models/user'

const EditBioTextBox = () => {
    const toast = useToast()
    const { whoAmI } = AVAStore.useState()
    const [isNewBioLoaded, setIsNewBioLoaded] = useState(false)
    const { isLoading, execute } = useAVAFetch(
        '/Account',
        { method: 'POST' },
        { manual: true }, // makes sure this request fires on user action
    )
    const onBioEdit = async (e) => {
        const newBio = e.target.textContent

        if (newBio == whoAmI?.bio) return

        setIsNewBioLoaded(false)
        const newUser: User = {
            ...(whoAmI as User),
            bio: newBio,
        }
        const response = await execute({ data: newUser })
        if (response.status == 200) {
            IdentityService.refreshIdentity()
            toast({
                title: 'Bio changed.',
                description: 'Your bio has been saved successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    useEffect(() => setIsNewBioLoaded(true), [whoAmI])
    const hasBio = whoAmI?.bio != undefined && whoAmI?.bio != ''

    return (
        <FormControl>
            <FormLabel>Bio</FormLabel>
            {isLoading || !isNewBioLoaded ? (
                <Spinner />
            ) : (
                <Editable
                    color={hasBio ? 'chakra-body-text' : 'gray'}
                    fontStyle={hasBio ? 'normal' : 'italic'}
                    placeholder='Click to enter a bio...'
                    defaultValue={whoAmI?.bio}
                >
                    <EditablePreview cursor='pointer' />
                    <EditableTextarea onBlurCapture={onBioEdit} />
                </Editable>
            )}
        </FormControl>
    )
}

export default EditBioTextBox
