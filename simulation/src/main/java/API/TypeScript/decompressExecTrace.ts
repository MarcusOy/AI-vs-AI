/*interface IStack<T> {
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    size(): number;
}

class Stack<T> implements IStack<T> {
    private storage: T[] = [];

    constructor(private capacity: number = Infinity) { }

    push(item: T): void {
        if (this.size() === this.capacity) {
            throw Error("Stack has reached max capacity, you cannot add more items");
        }
        this.storage.push(item);
    }

    pop(): T | undefined {
        return this.storage.pop();
    }

    peek(): T | undefined {
        return this.storage[this.size() - 1];
    }

    size(): number {
        return this.storage.length;
    }
}

const compString: string = "2-10|12|<<13-15|17-19>x3|13-16|8-10|12|<13-15|17-19>x3|13-15|17-19>x2|<13-15|17-19>x2|13-16|8-10|12-15|17-19|13|14|<15|<17-19|13-15>x4|16|8-10|12-14>x2|15|17-19|13-15|17|<18|<19|13-15|17|18>x4|19|13-16|8-10|12|<13-15|17-19>x2|13-15|17>x2|18|19|13-15|17-19|<13|<14|15|17-19|13>x4|14-16|8-10|12-15|17-19|13-15|17-19>x2|13-16|8-10|12|<13-15|17-19>x3|13-16|8-10|12|<13-15|17-19>x5|13-16|8-11|23|26";
const expected: string = "2|3|4|5|6|7|8|9|10|12|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|16|8|9|10|12|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|16|8|9|10|12|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|16|8|9|10|12|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|16|8|9|10|12|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|16|8|9|10|12|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|16|8|9|10|12|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|16|8|9|10|12|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|16|8|9|10|12|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|16|8|9|10|12|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|16|8|9|10|12|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|16|8|9|10|12|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|17|18|19|13|14|15|16|8|9|10|11|23|26";
console.log(compString);
const decompString: string = decompressExecTrace(compString);
console.log(expected);
console.log(decompString);
let areEqual: boolean = decompString.length == expected.length;
console.log("areEqual: " + areEqual);
for (let i: number = 0; i < expected.length; i++) {
    if (decompString[i] !== expected[i]) {
        areEqual = false;
        break;
    }
}
console.log("areEqual: " + areEqual);

function decompressExecTrace(compressedExecTrace: string): string {
    const result: string = "";
    const pipeSplit: string[] = compressedExecTrace.split("|");
    let workingString: string = compressedExecTrace;

    let cycleStack: Stack<string> = new Stack<string>();
    let hasStartedCycle: boolean = false;

    while (true) {
        const nextCycleStartIndex: number = workingString.indexOf("<");
        const nextCycleEndIndex: number = workingString.indexOf(">");
        console.log("nextStartIndex: " + nextCycleStartIndex);
        console.log("nextEndIndex: " + nextCycleEndIndex);

        let indexToUse: number;
        let startingCycle: boolean;

        // '<' is next closes
        if (nextCycleStartIndex >= 0 && (nextCycleStartIndex < nextCycleEndIndex || nextCycleEndIndex < 0)) {
            indexToUse = nextCycleStartIndex;
            startingCycle = true;
            console.log("starting cycle");
        }
        // '>' is next closes
        else if (nextCycleEndIndex >= 0) {
            indexToUse = nextCycleEndIndex;
            startingCycle = false;
            console.log("ending cycle");
        }
        // no more cycle parsing
        else {
            let popValue = cycleStack.pop();
            let popOptional: string = popValue == undefined ? "" : popValue;
            cycleStack.push(uncompressSequence(popOptional + "|" + workingString));
            console.log("done");
            break;
        }

        // inserts remaining chars to current stack element,
        let popValue = cycleStack.pop();
        let popOptional: string = popValue == undefined ? "" : popValue;
        const stringToInsert: string = (startingCycle && !hasStartedCycle) ? uncompressSequence(workingString.substring(0, indexToUse))
            : workingString.substring(0, indexToUse);
        if (!hasStartedCycle && startingCycle)
            hasStartedCycle = true;
        cycleStack.push(popOptional + stringToInsert);
        workingString = workingString.substring(indexToUse + (startingCycle ? 1 : 2));
        console.log("workingString: " + workingString);

        // either pushes or pops a new one depending on if starting or ending cycle
        if (startingCycle)
            cycleStack.push("");
        else {
            // parses the cycle length "<>x3"
            let cycleLengthString: string = "";
            while (workingString.length > 0) {
                const curChar: string = workingString.charAt(0);
                const curCharAsInt: number = parseInt(curChar);
                console.log("curCharAsInt: " + curCharAsInt);

                if (Number.isNaN(curCharAsInt))
                    break;

                cycleLengthString += curChar;
                workingString = workingString.substring(1);
                console.log("workingString: " + workingString);
            }
            let cycleLength = parseInt(cycleLengthString);

            // uncompresses the cycle contents
            const cyclePop = cycleStack.pop();
            const finishedCycleString: string = cyclePop == undefined ? "" : cyclePop;
            const uncompressedCycleString: String = uncompressSequence(finishedCycleString);

            // unrolls the cycle
            let unrolledCycleString = uncompressedCycleString;
            for (let i: number = 0; i < cycleLength - 1; i++)
                unrolledCycleString += "|" + uncompressedCycleString;

            let popValue = cycleStack.pop();
            let popOptional: string = popValue == undefined ? "" : popValue;
            cycleStack.push(popOptional + unrolledCycleString);
        }
    }

    let popVal = cycleStack.pop();

    return popVal == undefined ? "" : popVal;//result;
}

function uncompressSequence(input: String): string {
    console.log("input: " + input);
    let uncompressedCycleString: string = "";
    const pipeSplit: string[] = input.split("|");
    for (let i: number = 0; i < pipeSplit.length; i++) {
        const curSequence: string = pipeSplit[i];
        const indexOfDash: number = curSequence.indexOf("-");
        let modifedSequence: string = "";

        if (indexOfDash > 0) {
            const sequenceStartNum = parseInt(curSequence.substring(0, indexOfDash));
            const sequenceEndNum = parseInt(curSequence.substring(indexOfDash + 1));
            console.log("start: " + sequenceStartNum + "   end: " + sequenceEndNum);
            modifedSequence += sequenceStartNum + "";
            for (let line: number = sequenceStartNum + 1; line <= sequenceEndNum; line++)
                modifedSequence += "|" + line;
        }
        else
            modifedSequence = curSequence;

        if (uncompressedCycleString.length > 0)
            uncompressedCycleString += "|";

        uncompressedCycleString += modifedSequence;
    }

    console.log("output: " + uncompressedCycleString);
    return uncompressedCycleString;
}*/