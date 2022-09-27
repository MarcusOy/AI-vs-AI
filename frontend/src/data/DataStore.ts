import { Store } from 'pullstate'
import { User } from '../models/user'

interface IStore {
    whoAmI?: User
    hasSuccessfullyLoggedIn: boolean
    hasSuccessfullyLoggedOut: boolean
}

const initialState: IStore = {
    hasSuccessfullyLoggedIn: false,
    hasSuccessfullyLoggedOut: false,
}

export const AVAStore = new Store<IStore>(initialState)
