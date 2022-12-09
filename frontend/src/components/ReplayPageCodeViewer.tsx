import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { CodeBlock, vs2015 } from 'react-code-blocks'
import lineNumberColors from '../helpers/decompressExecTrace'

const HELPER_CODE_BORDER = '/*----- HELPER CODE BORDER -----*/'

interface IReplayPageCodeViewerProps {
    sourceCode: string
    executionTrace?: string
}

const ReplayPageCodeViewer = (p: IReplayPageCodeViewerProps) => {
    const lineFrequency = lineNumberColors(p.executionTrace ?? '1')
    console.log({ lineFrequency })

    const source =
        p.sourceCode.split(HELPER_CODE_BORDER).length == 2
            ? p.sourceCode.split(HELPER_CODE_BORDER)[1].trim()
            : p.sourceCode

    const numLines = source.split('\n').length

    return (
        <Flex
            overflow='scroll'
            width='100%'
            maxH={600}
            lineHeight={1.66667}
            background='rgb(30, 30, 30)'
            borderRadius='3px'
        >
            <Box fontSize={11} pt='8px' pl='4px'>
                {[...Array(numLines)].map((_, i) => {
                    return (
                        <Text
                            pl='6px'
                            borderLeftWidth='4px'
                            borderLeftColor={lineFrequency[i + 1] ?? 'transparent'}
                            key={i + 1}
                        >
                            {i + 1}
                        </Text>
                    )
                })}
            </Box>
            <CodeBlock
                highlight='13'
                customStyle={{
                    overflowX: 'unset',
                    // maxHeight: 600,
                    // width: '100%',
                }}
                codeContainerStyle={{
                    fontFamily: 'revert',
                    fontSize: 11,
                }}
                text={source}
                language='typescript'
                showLineNumbers={false}
                theme={vs2015}
            />
        </Flex>
    )
}

export default ReplayPageCodeViewer
