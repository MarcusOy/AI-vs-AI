import { Store } from 'pullstate'

interface IStore {
    isDarkMode: boolean
    counter: number
}

const initialState: IStore = {
    isDarkMode: false,
    counter: 0,
}

export const AVAStore = new Store<IStore>(initialState)
