import { AxiosRequestConfig } from 'axios'
import useAxios, { Options } from 'axios-hooks'

const useAVAFetch = (route: string, config?: AxiosRequestConfig, options?: Options) => {
    // make sure there is an API_ENDPOINT environment variable set
    if (process.env.REACT_APP_API_ENDPOINT == undefined) {
        const error =
            'Define REACT_APP_API_ENDPOINT as environment variable. See README.md to create an .env file.'
        console.error(error)
        throw error
    }

    // set override properties for config and options
    const requestConfig: AxiosRequestConfig = {
        ...config,
        baseURL: process.env.REACT_APP_API_ENDPOINT,
        url: route,
        withCredentials: true,
    }
    const requestOptions: Options = {
        ...options,
        useCache: false,
    }

    // base hook execution
    const [{ data, loading, error }, refetch] = useAxios(requestConfig, requestOptions)
    return {
        data,
        isLoading: loading,
        error,
        execute: refetch,
    }
}

export default useAVAFetch
