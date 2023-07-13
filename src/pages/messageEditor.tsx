import React, {createContext, FC, useContext, useEffect, useState} from "react";
import styles from './messageEditor.module.scss'
import IfThenElseBlock from "../components/ifThenElseBlock";
import {InputContext} from './context';

interface propsMessageEditor {
    arrVarNames: string[]
    template: string | null
    callbackSave?: () => {}
}

const MessageEditor: FC<propsMessageEditor> = ({
                                                   arrVarNames,
                                                   template,
                                                   callbackSave
                                               }) => {

    const [inputs, setInputs] = useState<Record<string, any>>({activeInput: {name: '', position: 1}, '1': '', '2': ''});

    const handleInputChange = (name: string, value: string) => {
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value
        }));
    };
    const handleInputFocus = (name: string, position: React.MutableRefObject<any>) => {
        console.log(position.current.selectionStart, position)
        setInputs((prevInputs) => ({
            ...prevInputs,
            activeInput: {name: name, position: position.current.selectionStart}
        }));
    }
    const handleButtonClick = (variable: string) => {
        if (inputs.activeInput) {
            setInputs((prevInputs) => {
                let cursorPosition = inputs.activeInput.position
                let content = prevInputs[inputs.activeInput.name]
                console.log(cursorPosition, content)
                let newContent = content.slice(0, cursorPosition) + '{' + variable + '}' + content.slice(cursorPosition, content.length);
                const updatedInputs = {
                    ...prevInputs,
                    [inputs.activeInput.name]: newContent
                };

                return {
                    ...updatedInputs,
                }
            });
        }
    };

    return <div className={styles.container}>
        <h1>Message Editor Template</h1>

        <div className={styles.variablesBlock}>
            {arrVarNames.map((item, index) => (
                <button key={index}
                        className={styles.variables}
                        onClick={() => handleButtonClick(item)}>{`{${item}}`}</button>
            ))}
        </div>

        <InputContext.Provider value={{inputs}}>
            <IfThenElseBlock onFocus={handleInputFocus} onChange={handleInputChange} name='1' value={inputs["1"]}/>
            <IfThenElseBlock onFocus={handleInputFocus} onChange={handleInputChange} name='2' value={inputs["2"]}/>
        </InputContext.Provider>
    </div>
}

export default MessageEditor
