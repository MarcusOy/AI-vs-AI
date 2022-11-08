import React from 'react'
import '@testing-library/jest-dom'
import { describe, expect, it, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders learn react link', () => {
    render(<App />)
    const linkElement = screen.getByText(/learn react/i)
    //@ts-ignore
    expect(linkElement).toBeInTheDocument()
})
