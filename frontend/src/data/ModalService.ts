import { AVAStore } from './DataStore'

class ModalService {
    static openBugReportModal() {
        AVAStore.update((s) => {
            s.modals.bugReportModalNumber++
        })
    }
    static openSearchModal() {
        AVAStore.update((s) => {
            s.modals.searchModalNumber++
        })
    }
}

export default ModalService
