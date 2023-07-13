import styles from "../pages/messageEditor.module.scss";
import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from "react";

const MIN_TEXTAREA_HEIGHT = 40;

interface IfThenElseBlockProps {
    name: string,
    value: string
    onChange: (name: string, value: string) => void,
    onFocus: (name: string, position: React.MutableRefObject<any>) => void
}

const IfThenElseBlock = ({onFocus, onChange, value, name}: IfThenElseBlockProps) => {
    const textareaRef = useRef<any>(null);

    const handleInputChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const {value} = event.currentTarget;
        onChange(name, value);
    };

    const handleSelectionChange = () => {
        if (textareaRef.current) {
            console.log(textareaRef.current.selectionStart)
            onFocus(name, textareaRef)
        }
    };
    useLayoutEffect(() => {
        textareaRef.current.style.height = "inherit";
        textareaRef.current.style.height = `${Math.max(
            textareaRef.current.scrollHeight,
            MIN_TEXTAREA_HEIGHT
        )}px`;
    }, [value]);

    return (<>
          <textarea ref={textareaRef}
                    className={styles.input}
                    onChange={handleInputChange}
                    value={value}
                    onSelect={handleSelectionChange}/>
    </>)
}

export default IfThenElseBlock
