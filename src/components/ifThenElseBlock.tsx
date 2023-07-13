import styles from "../pages/messageEditor.module.scss";
import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from "react";

const MIN_TEXTAREA_HEIGHT = 40;

interface IfThenElseBlockProps {
    name: string,
    value: string,
    isActive: boolean
    onChange: (name: string, value: string) => void,
    onFocus: (name: string, position: React.MutableRefObject<any>) => void,
    onConditionChange: (index: number, newStr: string) => void
}

const IfThenElseBlock = ({onFocus, onChange, value, name, isActive, onConditionChange}: IfThenElseBlockProps) => {
    const textareaRef = useRef<any>(null);

    const [isCondition, setIsCondition] = useState(false)
    const [ifStr, setIfStr] = useState('')
    const [thenStr, setThenStr] = useState('')
    const [elseStr, setElseStr] = useState('')
    const [finalStr, setFinalStr] = useState('')

    useEffect(() => {
        setIsCondition(isActive)
    }, [isActive])
    useEffect(() => {
        let final = '$' + `{${ifStr}} ? '${thenStr}' : '${elseStr}'`
        setFinalStr(final)
        console.log(final)
        if (ifStr) {
            onConditionChange(Number(name), final)
        }
    }, [ifStr, elseStr, thenStr])

    const handleInputChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const {value} = event.currentTarget;
        onChange(name, value );
    };

    const handleSelectionChange = () => {
        if (textareaRef.current) {
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
        {isCondition && <>
            <div>
                <div>if</div>
                <textarea onChange={(e) => setIfStr(e.currentTarget.value)}></textarea>
            </div>
            <div>
                <div>then</div>
                <textarea onChange={(e) => setThenStr(e.currentTarget.value)}></textarea>
            </div>
            <div>
                <div>else</div>
                <textarea onChange={(e) => setElseStr(e.currentTarget.value)}></textarea>
            </div>
        </>}
    </>)
}

export default IfThenElseBlock
