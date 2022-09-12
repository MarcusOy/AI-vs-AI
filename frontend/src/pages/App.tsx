import { Button } from '@chakra-ui/react'
import { AVAStore } from '../data/DataStore'
import React from 'react'

function App() {
    const { counter } = AVAStore.useState()

    const onClick = () => {
        AVAStore.update((s) => {
            s.counter++
        })
    }

    return (
        <div className='App'>
            <header className='App-header'>
                <img src='/logo.svg' className='App-logo' alt='logo' />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <Button onClick={onClick}>{counter}</Button>
                <a
                    className='App-link'
                    href='https://reactjs.org'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Learn React
                </a>
            </header>
        </div>
    )
}

export default App
