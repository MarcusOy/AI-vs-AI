import { extendTheme, withDefaultColorScheme, theme as baseTheme } from '@chakra-ui/react'

const theme = extendTheme(
    {
        colors: {
            primary: baseTheme.colors.cyan,
        },
    },
    withDefaultColorScheme({
        colorScheme: 'primary',
    }),
)

export default theme
