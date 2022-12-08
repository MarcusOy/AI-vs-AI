interface IStack<T> {
    push(item: T): void
    pop(): T | undefined
    peek(): T | undefined
    size(): number
}

class Stack<T> implements IStack<T> {
    private storage: T[] = []

    constructor(private capacity: number = Infinity) {}

    push(item: T): void {
        if (this.size() === this.capacity) {
            throw Error('Stack has reached max capacity, you cannot add more items')
        }
        this.storage.push(item)
    }

    pop(): T | undefined {
        return this.storage.pop()
    }

    peek(): T | undefined {
        return this.storage[this.size() - 1]
    }

    size(): number {
        return this.storage.length
    }
}

function decompressExecTrace(compressedExecTrace: string): string {
    const result: string = ''
    const pipeSplit: string[] = compressedExecTrace.split('|')
    let workingString: string = compressedExecTrace

    let cycleStack: Stack<string> = new Stack<string>()
    let hasStartedCycle: boolean = false

    while (true) {
        const nextCycleStartIndex: number = workingString.indexOf('<')
        const nextCycleEndIndex: number = workingString.indexOf('>')

        let indexToUse: number
        let startingCycle: boolean

        // '<' is next closes
        if (
            nextCycleStartIndex >= 0 &&
            (nextCycleStartIndex < nextCycleEndIndex || nextCycleEndIndex < 0)
        ) {
            indexToUse = nextCycleStartIndex
            startingCycle = true
        }
        // '>' is next closes
        else if (nextCycleEndIndex >= 0) {
            indexToUse = nextCycleEndIndex
            startingCycle = false
        }
        // no more cycle parsing
        else {
            let popValue = cycleStack.pop()
            let popOptional: string = popValue == undefined ? '' : popValue
            const strToPush: string = uncompressSequence(popOptional + workingString)
            cycleStack.push(strToPush)
            break
        }

        // inserts remaining chars to current stack element,
        let popValue = cycleStack.pop()
        let popOptional: string = popValue == undefined ? '' : popValue
        const stringToInsert: string =
            startingCycle && !hasStartedCycle
                ? uncompressSequence(workingString.substring(0, indexToUse))
                : workingString.substring(0, indexToUse)
        if (!hasStartedCycle && startingCycle) hasStartedCycle = true

        const strToPush: string = popOptional + stringToInsert
        cycleStack.push(strToPush)
        workingString = workingString.substring(indexToUse + (startingCycle ? 1 : 2))

        // either pushes or pops a new one depending on if starting or ending cycle
        if (startingCycle) cycleStack.push('')
        else {
            // parses the cycle length "<>x3"
            let cycleLengthString: string = ''
            while (workingString.length > 0) {
                const curChar: string = workingString.charAt(0)
                const curCharAsInt: number = parseInt(curChar)

                if (Number.isNaN(curCharAsInt)) break

                cycleLengthString += curChar
                workingString = workingString.substring(1)
            }
            let cycleLength = parseInt(cycleLengthString)

            // uncompresses the cycle contents
            const cyclePop = cycleStack.pop()
            const finishedCycleString: string = cyclePop == undefined ? '' : cyclePop
            const uncompressedCycleString: String = uncompressSequence(finishedCycleString)

            // unrolls the cycle
            let unrolledCycleString = uncompressedCycleString
            for (let i: number = 0; i < cycleLength - 1; i++)
                unrolledCycleString += '|' + uncompressedCycleString

            let popValue = cycleStack.pop()
            let popOptional: string = popValue == undefined ? '' : popValue
            const strToPush: string = popOptional + unrolledCycleString
            cycleStack.push(strToPush)
        }
    }

    let popVal = cycleStack.pop()

    return popVal == undefined ? '' : popVal
}

function uncompressSequence(input: String): string {
    let uncompressedCycleString: string = ''
    const pipeSplit: string[] = input.split('|')
    for (let i: number = 0; i < pipeSplit.length; i++) {
        const curSequence: string = pipeSplit[i]
        const indexOfDash: number = curSequence.indexOf('-')
        let modifedSequence: string = ''

        if (indexOfDash > 0) {
            const sequenceStartNum = parseInt(curSequence.substring(0, indexOfDash))
            const sequenceEndNum = parseInt(curSequence.substring(indexOfDash + 1))
            modifedSequence += sequenceStartNum + ''
            for (let line: number = sequenceStartNum + 1; line <= sequenceEndNum; line++)
                modifedSequence += '|' + line
        } else modifedSequence = curSequence

        if (uncompressedCycleString.length > 0) uncompressedCycleString += '|'

        uncompressedCycleString += modifedSequence
    }

    return uncompressedCycleString
}

export default uncompressSequence
