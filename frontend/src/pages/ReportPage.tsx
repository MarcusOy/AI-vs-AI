import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Input,
    Flex,
    Box,
    FormControl,
    FormLabel,
    Button,
    Center,
    Heading,
    FormErrorMessage,
    FormHelperText,
    Alert,
    AlertIcon,
    Stack,
    Grid,
    GridItem,
    ButtonGroup,
    Spacer,
    Editable,
    EditableInput,
    EditablePreview,
    Textarea,
    Select,
    Text,
} from '@chakra-ui/react'


const reportpage = () => {
    const [input, setInput] = useState('')

    const handleInputChange = (e) => setInput(e.target.value)

    const isError = input === ''
    const isNot = (input.length > 0) && (input.length < 500)
    return (
        <div color='black'>
            <Center>
                <Box bg='white' padding='300' color='black'>
                <FormControl isInvalid={isError}>
                    <FormLabel>DESCRIPTION</FormLabel>
                    <Textarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder='Enter the detail of the report.'
                        size='lg'
                    />
                    {!isError ? (
                        <FormHelperText>
                        Enter the detail of the report.
                        </FormHelperText>
                    ) : (
                        <FormErrorMessage>DESCRIPTION is required.</FormErrorMessage>
                    )}
                    </FormControl>
                    <Button isLoading={!isNot} colorScheme='teal' variant='solid' >
                    <Link to='/profile'>SUBMIT</Link>
                    </Button>
                       
                    
                    

                </Box>
            </Center>
        </div>
    )
}
export default reportpage