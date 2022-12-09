import { Box, Select, Spinner, useColorMode } from '@chakra-ui/react'
import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import React, { useEffect, useState } from 'react'
import useAVAFetch from '../../helpers/useAVAFetch'
import { ProgrammingLanguage } from '../../models/programming-language'
import { Strategy } from '../../models/strategy'
import { GameStarterCode } from '../../models/game-starter-code'
import useDebounce from '../../hooks/useDebounce'
import { StrategyStatus } from '../../models/strategy-status'

interface IProgrammingEditorProps {
    strategy: Strategy
    onStrategyChange: () => void
}

const ProgrammingEditor = (p: IProgrammingEditorProps) => {
    const { colorMode } = useColorMode()
    const [editorRef, setEditorRef] = useState<any>(null)
    const [monacoRef, setMonacoRef] = useState<any>(null)
    const monacoLanguage =
        p.strategy.language == ProgrammingLanguage.JavaScript ? 'javascript' : 'typescript'

    const [code, setCode] = useState(p.strategy.sourceCode)
    const debouncedCode = useDebounce(code, 1000)

    const { data, isLoading, execute } = useAVAFetch(
        `/StarterCode/${p.strategy.gameId}/${monacoLanguage}`,
    )
    const strategyUpdate = useAVAFetch('/Strategy/Update', { method: 'PUT' }, { manual: true })

    const initializeEditor = () => {
        const m = monacoRef as typeof monaco
        const e = editorRef as monaco.editor.IStandaloneCodeEditor
        let h = (data as GameStarterCode).helperCode!

        h += `function Console() {
            /**
             * Prints a single object/primitive out to the console window.
             * This function does not have all the functionality of a 
             * browser console.log().
             * 
             * @param {any} data - A single object/primitive to be printed
             */
              this.log = function(...data) {
                  // this is internal code that will print out printString
              };
          };
          var console = new Console();`

        m.languages.typescript.javascriptDefaults.setEagerModelSync(true)
        m.languages.typescript.javascriptDefaults.addExtraLib(h, 'HelperFunctions')
        m.languages.typescript.javascriptDefaults.setCompilerOptions({
            ...m.languages.typescript.javascriptDefaults.getCompilerOptions(),
            lib: ['es5'],
        })
        m.languages.typescript.typescriptDefaults.setEagerModelSync(true)
        m.languages.typescript.typescriptDefaults.addExtraLib(h, 'HelperFunctions')
        m.languages.typescript.typescriptDefaults.setCompilerOptions({
            ...m.languages.typescript.typescriptDefaults.getCompilerOptions(),
            lib: ['es5'],
        })
    }

    useEffect(() => {
        data && monacoRef && editorRef && initializeEditor()
    }, [data, monacoRef, editorRef])

    useEffect(() => {
        const newStrategy: Strategy = {
            ...p.strategy,
            sourceCode: debouncedCode,
        }
        strategyUpdate.execute({ data: newStrategy })
    }, [debouncedCode])

    return (
        <Box>
            <Editor
                language={monacoLanguage}
                defaultValue={p.strategy.sourceCode}
                theme={colorMode === 'light' ? 'vs-light' : 'vs-dark'}
                onChange={(v) => setCode(v!)}
                onMount={async (e, m) => {
                    setEditorRef(e)
                    setMonacoRef(m)
                    await execute()
                }}
                height='100%'
                width='100%'
                options={{
                    readOnly: p.strategy.status == StrategyStatus.Active,
                    minimap: {
                        enabled: false,
                    },
                }}
            />
            <Select
                size='xs'
                defaultValue={p.strategy.language}
                position='absolute'
                right='1rem'
                top='0'
                w='12rem'
                onChange={async (e) => {
                    const newValue = Number.parseInt(e.target.value)
                    if (p.strategy.language == newValue) return
                    const newStrategy: Strategy = {
                        ...p.strategy,
                        language: newValue,
                    }
                    await strategyUpdate.execute({ data: newStrategy })
                    p.onStrategyChange()
                }}
            >
                <option value={ProgrammingLanguage.JavaScript}>JavaScript</option>
                <option value={ProgrammingLanguage.TypeScript}>TypeScript</option>
            </Select>
            {strategyUpdate.isLoading && <Spinner position='absolute' right={10} bottom={10} />}
        </Box>
    )
}

export default ProgrammingEditor
