import { User } from '../models/user'
import { AVAStore } from './DataStore'

class IdentityService {
    static onLogin() {
        AVAStore.update((s) => {
            s.hasSuccessfullyLoggedIn = true
        })
    }

    static setIdentity(user: User) {
        AVAStore.update((s) => {
            s.whoAmI = user
        })
    }

    static unsetIdentity() {
        AVAStore.update((s) => {
            s.whoAmI = undefined
            s.hasSuccessfullyLoggedOut = false
            s.hasSuccessfullyLoggedIn = false
        })
    }
}

export default IdentityService
