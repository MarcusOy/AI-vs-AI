import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Select,
    Spinner,
    useToast,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AVAStore } from '../../data/DataStore'
import IdentityService from '../../data/IdentityService'
import useAVAFetch from '../../helpers/useAVAFetch'
import { Game } from '../../models/game'
import { User } from '../../models/user'

const EditFavoriteGameDropdown = () => {
    const toast = useToast()
    const { whoAmI } = AVAStore.useState()
    const [isNewGameLoaded, setIsNewGameLoaded] = useState(false)
    const { data, error, isLoading } = useAVAFetch('/Games')
    const updateFavoriteGame = useAVAFetch(
        '/Account',
        { method: 'POST' },
        { manual: true }, // makes sure this request fires on user action
    )
    const onFavGameEdit = async (e) => {
        const newGameId = e.target.value != '' ? e.target.value : null

        if (newGameId == whoAmI?.favoriteGameId) return

        setIsNewGameLoaded(false)
        const newUser: User = {
            ...(whoAmI as User),
            favoriteGameId: newGameId,
        }
        const response = await updateFavoriteGame.execute({ data: newUser })
        if (response.status == 200) {
            IdentityService.refreshIdentity()
            toast({
                title: 'Favorite game changed.',
                description: 'Your favorite game has been saved successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    useEffect(() => setIsNewGameLoaded(true), [updateFavoriteGame.data, updateFavoriteGame.error])

    const games: Game[] = data

    return (
        <FormControl isInvalid={error != null}>
            <FormLabel>Favorite game</FormLabel>
            {isLoading || !isNewGameLoaded ? (
                <Spinner />
            ) : (
                <Select
                    onChange={onFavGameEdit}
                    defaultValue={whoAmI?.favoriteGameId}
                    placeholder='Select a favorite game...'
                >
                    {games.map((g) => {
                        return (
                            <option key={g.id} value={g.id}>
                                {g.name}
                            </option>
                        )
                    })}
                </Select>
            )}
            <FormErrorMessage>{error?.response?.data}</FormErrorMessage>
        </FormControl>
    )
}

export default EditFavoriteGameDropdown
