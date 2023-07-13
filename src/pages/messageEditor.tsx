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

    const [inputs, setInputs] = useState<string[]>(['', '']);
    const [finalInputs, setFinalInputs] = useState<string[]>(['', '']);
    const [isConditional, setIsConditional] = useState<boolean[]>([false, false]);
    const [activeInput, setActiveInput] = useState({name: '', position: 0})

    const handleInputChange = (name: string, value: string) => {
        setInputs(prevState => {
            const newArray = [...prevState];
            newArray[Number(name)] = value;
            return newArray;
        })
        setFinalInputs(() => {
            const newArray = [];
            for(let i = 0; i < inputs.length; i ++){
                newArray[i*2] = inputs[i]
                newArray[i*2 + 1] = ''
            }
            newArray[Number(name) * 2] = value;
            //console.log(newArray)
            return newArray;
        })
    };
    const handleInputFocus = (name: string, position: React.MutableRefObject<any>) => {
        setActiveInput({name: name, position: position.current.selectionStart})
    }

    const handleButtonClick = (variable: string) => {

        if (activeInput) {
            setInputs((prevInputs) => {
                const newArray = [...prevInputs];
                let cursorPosition = activeInput.position
                let content = prevInputs[Number(activeInput.name)] ?? ''

                let newContent = content.slice(0, cursorPosition) + '{' + variable + '}' + content.slice(cursorPosition, content.length);
                newArray[Number(activeInput.name)] = newContent

                return [...newArray]
            });
        }
    };

    const handleAddBtnClick = () => {
      setIsConditional(prevState => {
          let newArr = [...prevState];
          newArr[Number(activeInput.name)] = !prevState[Number(activeInput.name)]
          return newArr
      })
    }
    const onFinalInputsChange = (index: number, newStr: string) =>{
        setFinalInputs(prevState => {
            let newArr = [...prevState];
            newArr[index*2 + 1] = newStr
            return newArr
        })
    }

    return <div className={styles.container}>
        <h1>Message Editor Template</h1>

        <div className={styles.variablesBlock}>
            {arrVarNames.map((item, index) => (
                <button key={index}
                        className={styles.variables}
                        onClick={() => handleButtonClick(item)}>{`{${item}}`}</button>
            ))}
        </div>
        <button className={styles.variables} onClick={handleAddBtnClick}>
            Add if then else block
        </button>

        <InputContext.Provider value={{inputs}}>

            {inputs.map((item, index) => (

                <IfThenElseBlock key={index}
                                 onFocus={handleInputFocus}
                                 onChange={handleInputChange}
                                 name={String(index)}
                                 value={inputs[index]}
                                 isActive={isConditional[index]}
                                 onConditionChange={onFinalInputsChange}/>
            ))}
            <div>{finalInputs}</div>

        </InputContext.Provider>
    </div>
}

export default MessageEditor
