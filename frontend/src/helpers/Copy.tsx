import { Button, Tag, TagCloseButton, TagLabel } from '@chakra-ui/react';
import React, { useState } from 'react';
interface CopyProps { 
    sourceCode: string
}
const Copy = (props: CopyProps) => {
    const [copied, setCopied] = useState(false);
    return (<>
            {!copied && <Button onClick={() => {sessionStorage.setItem('clipboard', props.sourceCode); setCopied(true) }}>
            Copy
        </Button>}
                {copied &&
            <Tag
            size={'lg'}
            borderRadius='full'
            variant='solid'
                        colorScheme='green'
                        mx='2'
            >
            <TagLabel>Copied!</TagLabel>
            <TagCloseButton onClick={() => setCopied(false)}/>
                </Tag>}
            </>
    );
}
export default Copy;