import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { observer } from "mobx-react";

import InputBlock from "../../components/input/inputBlock";
import PreviewModal from "../../components/previewModal/previewModal";
import messageStore from "../../store/messageStore";
import { state } from "../../types";
import styles from './messageEditor.module.scss';

interface propsMessageEditor {
    arrVarNames: string[]
    template: string | null
    callbackSave: (messages: Record<string, state>) => void
}

const MessageEditor: FC<propsMessageEditor> = observer(({
                                                            arrVarNames,
                                                            template,
                                                            callbackSave
                                                        }) => {

    const [activeInput, setActiveInput] = useState({id: '1', position: 0})
    const [sortedInputs, setSortedInputs] = useState<Array<state>>([])
    const [isPreview, setIsPreview] = useState(false)

    useEffect(() => {
        const store = localStorage.getItem('messages')
        if (store){
            messageStore.messages = JSON.parse(store)
            messageStore.messages['1'].value = template ?? ''
        }

        createStateArr()
    }, [])

    // Function to create a sorted array of inputs for rendering
    const createStateArr = () => {
        const arr: Array<state> = []
        const dfs = (id: string) => {
            if (id !== '0') {
                arr.push(messageStore.messages[id])
            }
            const children = messageStore.messages[id].children ?? []

            for (const childId of children) {
                dfs(childId)
            }
        }
        dfs('0')
        setSortedInputs(arr)
    }

    // Function to handle input focus and set the active input
    const handleInputFocus = (id: string, position: React.MutableRefObject<any>) => {
        setActiveInput({id: id, position: position.current.selectionStart})
    }

    // Function to delete messages and update the sorted inputs
    const deleteMessages = (id: string) => {
        messageStore.deleteGroupMessages(id)
        createStateArr()
    }

    const setInputValue = (id: string, value: string) => {
        messageStore.setValue(id, value)
    }

    // Function to handle adding a variable button click
    const handleAddVariableBtn = (variable: string) => {
        const str = messageStore.messages[activeInput.id].value
        const cursorPosition = activeInput.position

        setInputValue(activeInput.id, str.slice(0, cursorPosition) + '{' + variable + '}' + str.slice(cursorPosition, str.length))
    };

    const saveToLocalStorage = () => {
        callbackSave(messageStore.messages)
    }

    // Function to handle adding a new [if then else] block
    const handleAddBlockBtn = () => {
        const newId = Math.floor(Math.random() * (1000000));
        const cursorPosition = activeInput.position
        const str = messageStore.messages[activeInput.id].value
        const level = messageStore.messages[activeInput.id].level

        messageStore.addChildrenMessages([String(newId + 1), String(newId + 2), String(newId + 3)], activeInput.id)
        messageStore.addChildMessages(String(newId + 4), activeInput.id, messageStore.messages[activeInput.id].parent)

        messageStore.addNewMsg('if', String(newId + 1), activeInput.id, level + 1)
        messageStore.addNewMsg('then', String(newId + 2), activeInput.id, level + 1)
        messageStore.addNewMsg('else', String(newId + 3), activeInput.id, level + 1)
        messageStore.addNewMsg('', String(newId + 4), messageStore.messages[activeInput.id].parent, level)

        setInputValue(activeInput.id, str.slice(0, cursorPosition))
        setInputValue(String(newId + 4), str.slice(cursorPosition, str.length))
        //console.log(JSON.stringify(messageStore.messages['1']))
        createStateArr()
    }
    const checkConditionalBlock = () =>{
        const children =  messageStore.messages[activeInput.id].children ?? []
        if (children.length === 0){
            handleAddBlockBtn()
        }
    }

    const handlePreviewBtn = () => {
        setIsPreview(!isPreview)
    }

    return <div className={styles.container}>
        <h1>Message Editor Template</h1>

        <div className={styles.variablesBlock}>
            {arrVarNames.map((item, index) => (
                <button key={index}
                        className={styles.variables}
                        onClick={() => handleAddVariableBtn(item)}>{`{${item}}`}</button>
            ))}
        </div>
        <button className={styles.variables}
                onClick={checkConditionalBlock}>
            Add [if then else] block
        </button>
        {sortedInputs
            .map((item) => (
                <InputBlock key={item.id}
                            onFocus={handleInputFocus}
                            onChange={setInputValue}
                            id={item.id}
                            value={item.value}
                            condition={item.condition}
                            level={item.level}
                            deleteMessages={deleteMessages}/>
            ))}
        <div>
            <button className={styles.btn} onClick={handlePreviewBtn}>Preview</button>
            <button className={styles.btn} onClick={saveToLocalStorage}>Save</button>
            <Link to={'/'} className={styles.btn}>Close</Link>
        </div>
        {isPreview && createPortal(<PreviewModal onClick={handlePreviewBtn}
                                                 variables={arrVarNames}
                                                 template={messageStore.generateFinalMsg()}/>, document.body)}
    </div>
})

export default MessageEditor
