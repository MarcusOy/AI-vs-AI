import { Store } from 'pullstate'
import { User } from '../models/user'

interface IStore {
    whoAmI?: User
    whoAmIUpdateNumber: number
}

const initialState: IStore = {
    whoAmIUpdateNumber: 0,
}

export const AVAStore = new Store<IStore>(initialState)
