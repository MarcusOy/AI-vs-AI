package Simulation;

import org.jetbrains.annotations.NotNull;

public class CycleInfo implements Comparable {
    public String[] cycleStringArr;
    public int numRepetitions;
    public int firstCycleStartIndex;
    public int cycleLength;
    public int secondCycleEndIndex;
    public int lastCycleEndIndex;

    public static String DELIMITER = "|";
    public static String REPETITION_START_CHAR = "<";
    public static String REPETITION_END_CHAR = ">";

    public CycleInfo (String[] cycleStringArr, int numRepetitions, int firstCycleStartIndex, int cycleLength) {
        this.cycleStringArr = cycleStringArr;
        this.numRepetitions = numRepetitions;
        this.firstCycleStartIndex = firstCycleStartIndex;
        this.cycleLength = cycleLength;
        secondCycleEndIndex = firstCycleStartIndex + cycleLength * 2 - 1;
        lastCycleEndIndex = firstCycleStartIndex + cycleLength * numRepetitions - 1;
    }

    public int getNumCompressedLineNumsBeforeIndex(int indexToStopAt) {
        int result = ((indexToStopAt - firstCycleStartIndex + 1) / cycleLength - 1) * cycleLength;

        if (result < 0)
            result = 0;

        return result;
    }

    public String getUncompressedCycleString(int indexToStopAt) {
        int actualRepetitions = (indexToStopAt - firstCycleStartIndex + 1) / cycleLength;

        StringBuilder stringBuilder = new StringBuilder(REPETITION_START_CHAR);
        String cycleString = "";
        for (int i = 0; i < cycleLength; i++) {
            stringBuilder.append(cycleStringArr[firstCycleStartIndex + i]);

            if (i < cycleLength - 1)
                stringBuilder.append(DELIMITER/*", "*/);
        }
        stringBuilder.append(REPETITION_END_CHAR + "x" + actualRepetitions);

        cycleString = stringBuilder.toString();
        return cycleString;
    }

    public String getCompressedCycleString(int indexToStopAt) {
        int numCompressedLines = getNumCompressedLineNumsBeforeIndex(indexToStopAt);
        //System.out.println("numCompressedLines: " + numCompressedLines);

        return getUncompressedCycleString(indexToStopAt);//"[" + cycleStringArr[firstCycleStartIndex] + "-" + (cycleStringArr[firstCycleStartIndex + numCompressedLines - 1]) + "]x" + numRepetitions;
    }

    public String getCompressedCycleString() {
        return getCompressedCycleString(lastCycleEndIndex);
    }

    @Override
    public int compareTo(@NotNull Object o) {
        CycleInfo otherInfo = (CycleInfo)o;

        int compressedLinesComparison = otherInfo.getNumCompressedLineNumsBeforeIndex(otherInfo.lastCycleEndIndex) - getNumCompressedLineNumsBeforeIndex(lastCycleEndIndex);

        if (compressedLinesComparison == 0)
            return firstCycleStartIndex - otherInfo.firstCycleStartIndex;

        return compressedLinesComparison;
    }
}
