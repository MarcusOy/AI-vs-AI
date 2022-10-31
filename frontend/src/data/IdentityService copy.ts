import { User } from '../models/user'
import { AVAStore } from './DataStore'

class IdentityService {
    static refreshIdentity() {
        AVAStore.update((s) => {
            s.whoAmIUpdateNumber++
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
            s.whoAmIUpdateNumber++
        })
    }
}

export default IdentityService
