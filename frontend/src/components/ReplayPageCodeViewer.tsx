import { Box, ButtonGroup, Flex, Spinner, Text, IconButton, Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { CodeBlock, vs2015 } from 'react-code-blocks'
import { decompressExecTrace, lineNumberColors } from '../helpers/decompressExecTrace'
import { VscDebugStepBack, VscDebugStepOver, VscDebugConsole, VscDebugAlt } from 'react-icons/vsc'
import { MdLineStyle } from 'react-icons/md'

const HELPER_CODE_BORDER = '/*----- HELPER CODE BORDER -----*/'

interface IReplayPageCodeViewerProps {
    sourceCode: string
    executionTrace?: string
}

const ReplayPageCodeViewer = (p: IReplayPageCodeViewerProps) => {
    const [traceIndex, setTraceIndex] = useState(-1)
    const lines = decompressExecTrace(p.executionTrace ?? '1').split('|')
    const lineFrequency = lineNumberColors(p.executionTrace ?? '1')

    const source =
        p.sourceCode.split(HELPER_CODE_BORDER).length == 2
            ? p.sourceCode.split(HELPER_CODE_BORDER)[1].trim()
            : p.sourceCode

    const numLines = source.split('\n').length

    const toggleDebug = () => {
        if (traceIndex == -1) setTraceIndex(0)
        else setTraceIndex(-1)
    }

    const stepBackwards = () => {
        if (traceIndex > 0) setTraceIndex(traceIndex - 1)
    }

    const stepForwards = () => {
        if (traceIndex < lines.length - 1) setTraceIndex(traceIndex + 1)
    }

    return (
        <Stack alignItems='end'>
            <ButtonGroup size='sm' isAttached variant='outline'>
                <IconButton
                    tabIndex={-1}
                    aria-label='Toggle debug mode'
                    icon={<VscDebugAlt size={15} />}
                    variant={traceIndex >= 0 ? 'solid' : 'outline'}
                    onClick={toggleDebug}
                />
                <IconButton
                    tabIndex={-1}
                    aria-label='Step backward'
                    icon={<VscDebugStepBack size={15} />}
                    onClick={stepBackwards}
                    display={traceIndex > -1 ? 'inline-flex' : 'none'}
                    isDisabled={traceIndex <= 0}
                />
                <IconButton
                    tabIndex={-1}
                    aria-label='Step forward'
                    icon={<VscDebugStepOver size={15} />}
                    onClick={stepForwards}
                    display={traceIndex > -1 ? 'inline-flex' : 'none'}
                    isDisabled={traceIndex >= lines.length - 1}
                />
                <IconButton
                    tabIndex={-1}
                    aria-label='Toggle debug mode'
                    icon={<VscDebugConsole size={15} />}
                    // onClick={goForwardATurn}
                    // isDisabled={currentTurn == turns.length}
                />
            </ButtonGroup>
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
                    highlight={traceIndex >= 0 && lines[traceIndex]}
                    customStyle={{
                        overflowX: 'unset',
                        maxHeight: 500,
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
        </Stack>
    )
}

export default ReplayPageCodeViewer
