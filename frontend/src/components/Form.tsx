import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

interface IFormProps<T> {
    onFormSubmit: (data: T) => void
    onFormError: (errors: any, e: any) => void
    children: React.ReactNode
}

export interface IFormControlProps {
    name: any
    defaultValue?: any
}

const Form = <T,>(p: IFormProps<T>) => {
    const methods = useForm<T>()

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(p.onFormSubmit, p.onFormError)}>{p.children}</form>
            {/* <DevTool control={methods.control} /> */}
        </FormProvider>
    )
}

export default Form
