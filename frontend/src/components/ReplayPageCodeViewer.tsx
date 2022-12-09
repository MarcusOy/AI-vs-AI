import { Box, ButtonGroup, Flex, Spinner, Text, IconButton, Stack, Code } from '@chakra-ui/react'
import React, { useState } from 'react'
import { CodeBlock, vs2015 } from 'react-code-blocks'
import { decompressExecTrace, lineNumberColors } from '../helpers/decompressExecTrace'
import { VscDebugStepBack, VscDebugStepOver, VscDebugConsole, VscDebugAlt } from 'react-icons/vsc'
import { MdLineStyle } from 'react-icons/md'

const HELPER_CODE_BORDER = '/*----- HELPER CODE BORDER -----*/'
const CONSOLE_LOG_DELIMITER = '█'

interface IReplayPageCodeViewerProps {
    sourceCode: string
    executionTrace?: string
    printOutput?: string
}

interface ILog {
    index: number
    log: string
}

const ReplayPageCodeViewer = (p: IReplayPageCodeViewerProps) => {
    const [traceIndex, setTraceIndex] = useState(-1)
    const [showConsole, setShowConsole] = useState(false)
    const lines = decompressExecTrace(p.executionTrace ?? '1').split('|')
    const lineFrequency = lineNumberColors(p.executionTrace ?? '1')

    const splitOutput = p.printOutput ? p.printOutput.split(CONSOLE_LOG_DELIMITER) : []

    console.log({ splitOutput })

    const output: ILog[] = []
    for (let x = 0; x < splitOutput.length; x += 2) {
        output.push({
            index: Number.parseInt(splitOutput[x]) + 1,
            log: splitOutput[x + 1],
        })
    }

    const filteredOutput = traceIndex > -1 ? output.filter((l) => l.index <= traceIndex) : output
    filteredOutput.reverse()

    const source =
        p.sourceCode.split(HELPER_CODE_BORDER).length == 2
            ? p.sourceCode.split(HELPER_CODE_BORDER)[1].trim()
            : p.sourceCode

    const numLines = source.split('\n').length

    const toggleDebug = () => {
        if (traceIndex == -1) {
            setTraceIndex(0)
            setShowConsole(true)
        } else {
            setTraceIndex(-1)
            setShowConsole(false)
        }
    }

    const stepBackwards = () => {
        if (traceIndex > 0) {
            setTraceIndex(traceIndex - 1)
            const line = document.getElementById('line-' + lines[traceIndex])
            if (line) line.scrollIntoView()
        }
    }

    const stepForwards = () => {
        if (traceIndex < lines.length - 1) {
            setTraceIndex(traceIndex + 1)
            const line = document.getElementById('line-' + lines[traceIndex])
            if (line) line.scrollIntoView()
        }
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
                    variant={showConsole ? 'solid' : 'outline'}
                    onClick={() => setShowConsole(!showConsole)}
                />
            </ButtonGroup>
            <Flex
                overflow='scroll'
                width='100%'
                maxH={showConsole ? 400 : 600}
                lineHeight={1.66667}
                background='rgb(30, 30, 30)'
                borderRadius='3px'
            >
                <Box fontSize={11} pt='8px' pl='4px'>
                    {[...Array(numLines)].map((_, i) => {
                        return (
                            <Text
                                id={'line-' + (i + 1).toString()}
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
            <Stack
                background='rgb(30, 30, 30)'
                w='100%'
                h={showConsole ? 300 : 0}
                overflow='scroll'
                fontFamily={`source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace${''}`}
                whiteSpace='pre'
                flexShrink={1}
                flexDir='column-reverse'
                p={2}
            >
                {filteredOutput.length <= 0 && <pre>No console output yet.</pre>}
                {filteredOutput.map((l, i) => {
                    return (
                        <Box key={i} borderBottomWidth={1} p={2}>
                            <b>Line {lines[l.index - 1]}:</b>
                            <pre>{l.log + '\n'}</pre>
                        </Box>
                    )
                })}
            </Stack>
        </Stack>
    )
}

export default ReplayPageCodeViewer
