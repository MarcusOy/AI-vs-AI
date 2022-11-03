import { Store } from 'pullstate'
import { User } from '../models/user'

interface IStore {
    whoAmI?: User
    whoAmIUpdateNumber: number
    modals: {
        bugReportModalNumber: number
        searchModalNumber: number
    }
}

const initialState: IStore = {
    whoAmIUpdateNumber: 0,
    modals: {
        bugReportModalNumber: 0,
        searchModalNumber: 0,
    },
}

export const AVAStore = new Store<IStore>(initialState)
