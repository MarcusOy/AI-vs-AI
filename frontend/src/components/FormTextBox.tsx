import {
    FormControl,
    FormControlProps,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    InputProps,
} from '@chakra-ui/react'
import { useFormContext, RegisterOptions, FieldValues, FieldPath } from 'react-hook-form'
import React from 'react'
import { IFormControlProps } from './Form'

interface IFormTextBoxProps extends IFormControlProps {
    label?: string
    helperText?: string
    controlProps?: FormControlProps
    inputProps: InputProps
    validationProps?: RegisterOptions<FieldValues, FieldPath<FieldValues>>
}

export const FormTextBox = (p: IFormTextBoxProps) => {
    const { register, formState } = useFormContext()
    const fieldError = formState.errors[p.name]

    return (
        <FormControl {...p.controlProps} isInvalid={fieldError != undefined}>
            {p.label && <FormLabel>{p.label}</FormLabel>}
            <Input {...register(p.name, p.validationProps)} {...p.inputProps} />
            {p.helperText && <FormHelperText>{p.helperText}</FormHelperText>}
            {fieldError && <FormErrorMessage>{fieldError.message?.toString()}</FormErrorMessage>}
        </FormControl>
    )
}

export default FormTextBox
