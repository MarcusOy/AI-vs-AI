import * as React from 'react'

const useDocumentTitle = (title?: string) => {
    React.useEffect(() => {
        const t = ['Ai vs. Ai']
        if (title && title != '') t.unshift(title)
        document.title = t.join(' - ')
    }, [title])
}

export default useDocumentTitle
