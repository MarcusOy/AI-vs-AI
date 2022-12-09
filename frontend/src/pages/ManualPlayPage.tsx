import React, { useEffect, useRef, useState } from 'react'
import GameboardViewer, { GAME_COLORS } from '../components/GameboardViewer'
import {
    Stack,
    HStack,
    Center,
    Box,
    Text,
    Heading,
    Spinner,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    Select,
} from '@chakra-ui/react'
import { initialState } from '../data/ChessBoard'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { useReward } from 'react-rewards'
import useDocumentTitle from '../hooks/useDocumentTitle'

export const BOARD_SIZES = {
    DEFAULT: 600, // for replay view
    INTERACTIVE: 700, // for manual play
    RECAP: 150, // for list display
}

const ReplayPage = () => {
    const connectionRef = useRef<HubConnection | null>(null)
    const [board, setBoard] = useState(initialState)
    const selectedAi = useRef<string>('00000000-0000-0000-0000-000000000000')
    const boardRef = useRef<string[][]>(initialState)
    const [isWaiting, setIsWaiting] = useState(false)
    const [winner, setWinner] = useState<'Player' | 'AI' | null>(null)
    const [isPlayerWhite, setIsPlayerWhite] = useState(true)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { reward } = useReward('rewardId', 'confetti')

    useDocumentTitle('Manual Play')

    // create connection to SimulationStepHub
    useEffect(() => {
        const signalRConnection = new HubConnectionBuilder()
            // @ts-ignore
            .withUrl(process.env.REACT_APP_API_ENDPOINT + 'AI')
            .withAutomaticReconnect()
            .build()
        connectionRef.current = signalRConnection
        onConnectionCreated()
    }, [])

    // setup event handlers to SimulationStepHub
    const onConnectionCreated = () => {
        if (connectionRef.current) {
            connectionRef.current
                .start()
                .then(() => {
                    console.log('Connected.')
                    connectionRef.current!.on('StepResponse', (response) => {
                        const newBoard = response.resultingBoard as string[][]
                        setBoard(newBoard)
                        setIsWaiting(false)

                        // if game is over, set winner
                        if (response.isGameOver)
                            setWinner(response.didAttackerWin ? 'Player' : 'AI')
                    })
                })
                .catch((e) => console.log('Connection failed: ', e))
        }
    }

    // sync shadow board state in useRef hook (because
    // eventlister context doesn't like useState)
    useEffect(() => {
        boardRef.current = board
    }, [board])

    const onBoardChange = (newBoard: string[][]) => {
        const prevBoard = boardRef.current
        setBoard(newBoard)

        if (connectionRef.current && connectionRef.current.state == 'Connected') {
            setIsWaiting(true)
            try {
                connectionRef.current.send('StepRequest', {
                    sentBoard: newBoard,
                    isWhiteAi: !isPlayerWhite,
                    clientid: connectionRef.current.connectionId,
                    chosenStockId: selectedAi.current,
                })
            } catch (e) {
                console.log('Could not send StepRequest', e)
                setBoard(prevBoard)
            }
        } else {
            alert('No connection to server yet.')
            setBoard(prevBoard)
        }
    }

    // if winner is declared, open game-over modal
    useEffect(() => {
        if (winner != null) {
            onOpen()

            // shoot confetti if player won
            if (winner == 'Player') setTimeout(reward, 500)
        }
    }, [winner])

    const size = BOARD_SIZES.INTERACTIVE

    console.log({ selectedAi })

    return (
        <>
            <Stack alignItems='center'>
                <HStack w={size}>
                    <Box
                        bg={GAME_COLORS.WHITE_PIECE.FILL}
                        borderColor={GAME_COLORS.WHITE_PIECE.STROKE}
                        borderWidth={4}
                        borderRadius={10}
                        w={10}
                        h={10}
                    />
                    <Heading fontSize='xl'>Player</Heading>
                    {!isWaiting && <ArrowBackIcon w={8} h={8} />}
                    <Box flexGrow={1} />
                    {isWaiting && <Spinner />}
                    {isWaiting && <ArrowForwardIcon w={8} h={8} />}
                    <Select
                        fontSize='xl'
                        fontWeight='bold'
                        w='10rem'
                        onChange={(a) => {
                            selectedAi.current = a.target.value
                        }}
                    >
                        <option value='00000000-0000-0000-0000-000000000000'>Random AI</option>
                        <option value='ecce68c3-9ce0-466c-a7b5-5bf7affd5189'>Hard AI</option>
                    </Select>
                    <Box
                        bg={GAME_COLORS.BLACK_PIECE.FILL}
                        borderColor={GAME_COLORS.BLACK_PIECE.STROKE}
                        borderWidth={4}
                        borderRadius={10}
                        w={10}
                        h={10}
                    />
                </HStack>
                <Center>
                    <GameboardViewer
                        type={isWaiting ? 'Non-interactive' : 'Interactive'}
                        size={size}
                        board={board}
                        onBoardChange={onBoardChange}
                    />
                </Center>
            </Stack>
            <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Game Over</ModalHeader>
                    <ModalBody>
                        <Center>
                            <Box id='rewardId' />
                        </Center>
                        {winner == 'Player' && <Text>Congratulations, you won!</Text>}
                        {winner == 'AI' && <Text>You lost. Better luck next time!</Text>}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='blue'
                            mr={3}
                            onClick={() => {
                                onClose()
                                setBoard(initialState)
                                setWinner(null)
                            }}
                        >
                            Play again
                        </Button>
                        <Button onClick={() => history.back()} variant='ghost'>
                            Exit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ReplayPage
