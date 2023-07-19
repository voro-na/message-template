import React, {useLayoutEffect, useRef} from "react";
import styles from './inputBlock.module.scss'

const MIN_TEXTAREA_HEIGHT = 40;

interface IfThenElseBlockProps {
    id: string,
    value: string,
    condition: string,
    level: number
    onChange: (name: string, value: string) => void,
    onFocus: (name: string, position: React.MutableRefObject<any>) => void,
    deleteMessages: (id: string) => void
}

const InputBlock = ({onFocus, onChange, value, id, condition, level, deleteMessages}: IfThenElseBlockProps) => {
    const textareaRef = useRef<any>(null);
    const maxWidth = `calc(100% - ${100 * (level + 1)}px)`

    const handleInputChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const {value} = event.currentTarget;
        onChange(id, value);
    };

    const handleSelectionChange = () => {
        if (textareaRef.current) {
            onFocus(id, textareaRef)
        }
    };
    const onClickDelete = () => {
        deleteMessages(id)
    }
    useLayoutEffect(() => {
        textareaRef.current.style.height = "inherit";
        textareaRef.current.style.height = `${Math.max(
            textareaRef.current.scrollHeight,
            MIN_TEXTAREA_HEIGHT
        )}px`;
    }, [value]);

    return (
        <div className={styles.container} style={{maxWidth}}>
            {condition && <div className={styles.condition}>{condition}</div>}

            {condition === 'if' && <button className={styles.btn}
                                           onClick={onClickDelete}>delete</button>}

            <textarea ref={textareaRef}
                      placeholder={'Input message'}
                      onChange={handleInputChange}
                      value={value}
                      onSelect={handleSelectionChange}
                      className={styles.input}
            />
        </div>)
}

export default InputBlock
