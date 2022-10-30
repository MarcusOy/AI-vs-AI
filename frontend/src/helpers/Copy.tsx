import { Button } from '@chakra-ui/react';
import React from 'react';
interface CopyProps { 
    sourceCode: string
}
const Copy = (props: CopyProps) => {
    return (
        <Button onClick={() => {sessionStorage.setItem('clipboard', props.sourceCode)}}>
            Copy
        </Button>
    );
}
export default Copy;