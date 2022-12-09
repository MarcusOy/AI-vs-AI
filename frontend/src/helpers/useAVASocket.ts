import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { useEffect, useState } from 'react'

interface AVASocketCallback {
    key: string
    execute: (res) => void
}

const useAVASocket = (callbacks: AVASocketCallback[]) => {
    const [connection, setConnection] = useState<HubConnection | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const signalRConnection = new HubConnectionBuilder()
            // @ts-ignore
            .withUrl(process.env.REACT_APP_API_ENDPOINT + 'AI')
            .withAutomaticReconnect()
            .build()
        setConnection(signalRConnection)
    }, [])
    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    console.log('AVASocket connected.')
                    setIsConnected(true)
                    setIsLoading(false)
                    callbacks.map((c) => connection.on(c.key, c.execute))
                })
                .catch((e) => {
                    console.log('AVASocket Connection failed: ', e)
                    setIsConnected(false)
                    setIsLoading(false)
                })
        }
    }, [connection])

    return { connection, isLoading, isConnected }
}

export default useAVASocket
