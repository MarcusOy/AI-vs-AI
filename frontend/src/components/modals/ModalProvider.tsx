import React from 'react'
import { AVAStore } from '../../data/DataStore'
import BugReportModal from './ReportBugModal'
import SearchModal from './SearchModal'

export interface IModalProps {
    openNum: number
}

const ModalProvider = () => {
    const { bugReportModalNumber: bugNum, searchModalNumber: searchNum } = AVAStore.useState(
        (s) => s.modals,
    )

    return (
        <>
            <BugReportModal openNum={bugNum} />
            <SearchModal openNum={searchNum} />
        </>
    )
}

export default ModalProvider
