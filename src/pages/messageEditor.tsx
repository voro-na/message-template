import React, {FC, useEffect, useState} from "react";
import styles from './messageEditor.module.scss'
import InputBlock from "../components/inputBlock";
import messageStore from "../store/messageStore";
import {observer} from "mobx-react";
import {createPortal} from "react-dom";
import PreviewModal from "../components/previewModal";

interface propsMessageEditor {
    arrVarNames: string[]
    template: string | null
    callbackSave?: () => {}
}

interface state {
    parent:  string,
    value: string,
    children: string[] | undefined,
    id: string
    condition: string,
    level: number
}

const MessageEditor: FC<propsMessageEditor> = observer(({
                                                            arrVarNames,
                                                            template,
                                                            callbackSave
                                                        }) => {

    const [activeInput, setActiveInput] = useState({id: '1', position: 0})
    const [sortedInputs, setSortedInputs] = useState<Array<state>>([])
    const [isPreview, setIsPreview] = useState(false)

    useEffect(() =>{
        createStateArr()
    }, [])

    let createStateArr = () => {
        let arr: Array<state> = []
        let dfs = (id: string) => {
            if (id !== '0'){
                arr.push(messageStore.messages[id])
            }
            let children = messageStore.messages[id].children ?? []

            for (let childId of children) {
                    dfs(childId)
            }
        }
        dfs('0')
        setSortedInputs(arr)
    }

    const handleInputFocus = (id: string, position: React.MutableRefObject<any>) => {
        setActiveInput({id: id, position: position.current.selectionStart})
    }

    const deleteMessages = (id: string) => {
        messageStore.deleteGroup(id)
        createStateArr()
    }

    const setInputValue = (id: string, value: string) => {
        messageStore.setValue(id, value)
    }

    const handleAddVariableBtn = (variable: string) => {
        let str = messageStore.messages[activeInput.id].value
        let cursorPosition = activeInput.position

        setInputValue(activeInput.id, str.slice(0, cursorPosition) + '{' + variable + '}' + str.slice(cursorPosition, str.length))
    };

    const handleAddBlockBtn = () => {
        let newId = Math.floor(Math.random() * (100000));
        let cursorPosition = activeInput.position
        let str = messageStore.messages[activeInput.id].value
        let level = messageStore.messages[activeInput.id].level

        messageStore.addChildren([String(newId + 1), String(newId + 2), String(newId + 3)], activeInput.id)
        //messageStore.addChildren([String(newId + 4)], messageStore.messages[activeInput.id].parent)
        messageStore.addChild(String(newId + 4), activeInput.id, messageStore.messages[activeInput.id].parent)

        messageStore.addNewMsg('if', String(newId + 1), activeInput.id,level + 1)
        messageStore.addNewMsg('then', String(newId + 2), activeInput.id, level + 1)
        messageStore.addNewMsg('else', String(newId + 3), activeInput.id, level + 1)
        messageStore.addNewMsg('', String(newId + 4), messageStore.messages[activeInput.id].parent, level)
        //console.log( JSON.stringify(messageStore.messages))
        setInputValue(activeInput.id, str.slice(0, cursorPosition))
        setInputValue(String(newId + 4), str.slice(cursorPosition, str.length))
        createStateArr()
    }
    const handlePreviewBtn = () =>{
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
                onClick={handleAddBlockBtn}>
            Add if then else block
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
        <div >
            <button className={styles.btn} onClick={handlePreviewBtn}>Preview</button>
            <button className={styles.btn}>Save</button>
            <button className={styles.btn}>Close</button>
        </div>
        {isPreview && createPortal(<PreviewModal onClick={handlePreviewBtn} variables={arrVarNames}
        template={messageStore.generateFinalMsg2()}/>, document.body)}
    </div>
})

export default MessageEditor
