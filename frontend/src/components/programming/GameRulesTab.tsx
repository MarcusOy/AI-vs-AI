import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
    Box,
    Center,
    Flex,
    Heading,
    HStack,
    IconButton,
    Progress,
    Stack,
    Text,
    Image,
    ButtonGroup,
    Button,
    UnorderedList,
    ListItem,
    OrderedList,
} from '@chakra-ui/react'
import React, { useState } from 'react'

const GameOverviewPage = () => {
    return (
        <Stack>
            <Text>
                <b>1234Chess</b> is a board game that acts similar to regular chess. Here is the
                starting board state:
            </Text>
            <Image
                src='/img/tutorial/1/StartingPosition.png'
                alt='1234Chess starting board state'
            />
            <Text>
                Two sides will fight each other to complete one of two objectives:{' '}
                <b>Elimination</b> and <b>Infiltration</b>. White, which is always positioned on the{' '}
                <b>bottom</b>, will <b>start first</b> every game.
            </Text>
        </Stack>
    )
}

const GameMovementPage = () => {
    const [pieceNum, setPieceNum] = useState(1)

    return (
        <Stack>
            <Text>
                Each piece can move in <b>any direction</b> <em>n</em> spaces away, where <em>n</em>{' '}
                is the number that is displayed on the body of the piece.
            </Text>
            <Image
                src={`/img/tutorial/1/Movement_${pieceNum}.png`}
                alt='1234Chess valid movements'
            />
            <Center>
                <ButtonGroup size='sm' isAttached variant='outline'>
                    <Button
                        aria-label='Toggle piece number 1'
                        variant={pieceNum == 1 ? 'solid' : 'outline'}
                        onClick={() => setPieceNum(1)}
                    >
                        1
                    </Button>
                    <Button
                        aria-label='Toggle piece number 2'
                        variant={pieceNum == 2 ? 'solid' : 'outline'}
                        onClick={() => setPieceNum(2)}
                    >
                        2
                    </Button>
                    <Button
                        aria-label='Toggle piece number 3'
                        variant={pieceNum == 3 ? 'solid' : 'outline'}
                        onClick={() => setPieceNum(3)}
                    >
                        3
                    </Button>
                    <Button
                        aria-label='Toggle piece number 4'
                        variant={pieceNum == 4 ? 'solid' : 'outline'}
                        onClick={() => setPieceNum(4)}
                    >
                        4
                    </Button>
                </ButtonGroup>
            </Center>
            <Text>
                The only exceptions to this rule is moving to a <b>friendly piece</b> or{' '}
                <b>off the board</b>.
            </Text>
        </Stack>
    )
}

const GameCapturePage = () => {
    const [captureType, setCaptureType] = useState<'Capture' | 'Trade' | 'Suicide'>('Capture')

    const attackDescription =
        captureType == 'Capture' ? (
            <>
                A <b>White 3</b> attacks a <b>Black 2</b>. <br /> {'> '}The <b>White 3</b> kills the{' '}
                <b>Black 2</b> and takes its spot.
            </>
        ) : captureType == 'Trade' ? (
            <>
                A <b>White 2</b> attacks a <b>Black 2</b>. <br /> {'> '} Both pieces are killed.
            </>
        ) : (
            <>
                A <b>White 1</b> attacks a <b>Black 2</b>. <br /> {'> '} The <b>Black 2</b> stands
                its ground and the <b>White 1</b> is killed.
            </>
        )

    return (
        <Stack>
            <Text>
                To progress in 1234Chess, your pieces should be strategically attacking enemy
                pieces. A piece&apos;s strength is determined by the number on the body of the
                piece. Below are three attack scenarios:
            </Text>
            <Image
                src={`/img/tutorial/1/${captureType}_Example.png`}
                alt='1234Chess capture methods'
            />
            <Center>
                <ButtonGroup size='sm' isAttached variant='outline'>
                    <Button
                        aria-label='Toggle capture'
                        variant={captureType == 'Capture' ? 'solid' : 'outline'}
                        onClick={() => setCaptureType('Capture')}
                    >
                        Capture
                    </Button>
                    <Button
                        aria-label='Toggle trade'
                        variant={captureType == 'Trade' ? 'solid' : 'outline'}
                        onClick={() => setCaptureType('Trade')}
                    >
                        Trade
                    </Button>
                    <Button
                        aria-label='Toggle suicide'
                        variant={captureType == 'Suicide' ? 'solid' : 'outline'}
                        onClick={() => setCaptureType('Suicide')}
                    >
                        Suicide
                    </Button>
                </ButtonGroup>
            </Center>
            <Text>{attackDescription}</Text>
        </Stack>
    )
}

const GameObjectivePage = () => {
    const [victoryType, setVictoryType] = useState<'Infiltration' | 'Elimination'>('Infiltration')

    const victoryDescription =
        victoryType == 'Infiltration' ? (
            <>
                <b>Infiltration</b> occurs when a 1 piece crosses the opponent&apos;s back row.
                <br />
                <br /> A <b>White 1</b> enters Black&apos;s back row. <br /> {'> '}White wins!
            </>
        ) : (
            <>
                <b>Elimination</b> occurs when you capture every opponent&apos;s 1 piece. <br />
                <br />A <b>White 4</b> attacks <b>Black&apos;s last 1</b>. <br /> {'> '} White wins!
            </>
        )

    return (
        <Stack>
            <Text>To win a game of 1234Chess, you must complete either one of two objectives.</Text>
            <Image
                src={`/img/tutorial/1/${victoryType}_Victory.png`}
                alt='1234Chess victory methods'
            />
            <Center>
                <ButtonGroup size='sm' isAttached variant='outline'>
                    <Button
                        aria-label='Toggle capture'
                        variant={victoryType == 'Infiltration' ? 'solid' : 'outline'}
                        onClick={() => setVictoryType('Infiltration')}
                    >
                        Infiltration
                    </Button>
                    <Button
                        aria-label='Toggle trade'
                        variant={victoryType == 'Elimination' ? 'solid' : 'outline'}
                        onClick={() => setVictoryType('Elimination')}
                    >
                        Elimination
                    </Button>
                </ButtonGroup>
            </Center>
            <Text>{victoryDescription}</Text>
        </Stack>
    )
}

const GameMiscellaneousPage = () => {
    return (
        <Stack>
            <Text>A few more miscellaneous rules:</Text>

            <UnorderedList pl={4}>
                <ListItem>
                    In the unlikely event that a player captures the opponent&apos;s last 1-piece
                    with the player&apos;s last 1-piece, causing both to be removed from play, the
                    player who just moved and made the capture wins
                </ListItem>
                <ListItem>
                    In the unlikely event 1000 moves get played without someone winning, a
                    tiebreaker occurs to decide who won. The tiebreakers are in order:
                </ListItem>
            </UnorderedList>
            <OrderedList pl={12}>
                <ListItem>Most 1-pieces remaining</ListItem>
                <ListItem>Most pieces remaining</ListItem>
                <ListItem>Farthest advanced 1-piece by row</ListItem>
                <ListItem>Black</ListItem>
            </OrderedList>
        </Stack>
    )
}

const pages = [
    {
        title: 'Overview',
        component: <GameOverviewPage />,
    },
    {
        title: 'Movement',
        component: <GameMovementPage />,
    },
    {
        title: 'Capturing',
        component: <GameCapturePage />,
    },
    {
        title: 'Objectives',
        component: <GameObjectivePage />,
    },
    {
        title: 'Miscellaneous',
        component: <GameMiscellaneousPage />,
    },
]

const GameRulesTab = () => {
    const [index, setIndex] = useState(0)

    const goBack = () => {
        if (index > 0) setIndex(index - 1)
    }
    const goForward = () => {
        if (index < pages.length - 1) setIndex(index + 1)
    }

    return (
        <Box h='100%' textAlign='left'>
            <Flex h='100%' justifyContent='center'>
                <Stack spacing='5' flexGrow={1} maxW='sm'>
                    <Heading fontSize='lg'>1234Chess</Heading>
                    <Box my={5} flexGrow={1}>
                        {pages[index].component}
                    </Box>
                    <HStack>
                        <IconButton
                            aria-label='Go forward a page'
                            icon={<ChevronLeftIcon w='7' h='7' />}
                            variant='ghost'
                            onClick={goBack}
                            isDisabled={index <= 0}
                        />
                        <Stack flexGrow={1}>
                            <Center>
                                <Heading fontSize='sm'>
                                    {index + 1}. {pages[index].title}
                                </Heading>
                            </Center>
                            <Progress value={((index + 1) / pages.length) * 100} size='xs' />
                        </Stack>
                        <IconButton
                            aria-label='Go back a page'
                            icon={<ChevronRightIcon w='7' h='7' />}
                            variant='ghost'
                            onClick={goForward}
                            isDisabled={index >= pages.length - 1}
                        />
                    </HStack>
                </Stack>
            </Flex>
        </Box>
    )
}

export default GameRulesTab
