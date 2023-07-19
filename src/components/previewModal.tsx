import styles from './previewModal.module.scss'
import React, {useEffect, useState} from "react";

interface PreviewModalProps {
    onClick: () => void,
    variables: string[],
    template: string[][]
}
const PreviewModal = ({onClick, variables, template}: PreviewModalProps) => {
    const [finalTemplate, setFinalTemplate] = useState('')
    const [valueOfVar, setValueOfVar] = useState<Record<string, string>>(variables.reduce((o, key) => ({ ...o, [key]: ''}), {}))

    useEffect(() =>{
        onVariableChange('', variables[0])
    }, [])

    let onVariableChange = (value: string, variable: string) =>{

        setValueOfVar(prevState => {
            prevState[variable] = value
            return prevState
        })
        let str = ''
        let thenArr = [], elseArr = []
        for(let i = 0; i < template.length; i ++){
            let newStr = template[i][0]
            for (let v in valueOfVar){
                newStr = newStr.replaceAll(`{${v}}`, valueOfVar[v])
            }
            if (template[i].length > 1) {

                let condition = template[i][1]
                let id = template[i][2]

                if (condition === 'if' && newStr.length > 0) {
                    thenArr.push(id)
                    str += newStr + ' '
                } else if (condition === 'if' && newStr.length === 0) {
                    elseArr.push(id)
                    str += newStr + ' '
                } else if (condition === 'then' && thenArr.indexOf(String(Number(id) - 1)) !== -1) {
                    str += newStr + ' '
                } else if (condition === 'else' && elseArr.indexOf(String(Number(id) - 2)) !== -1) {
                    str += newStr + ' '
                }
            }else{
                str += newStr + ' '
            }
        }
        setFinalTemplate(str)
    }
  return <div className={styles.container}>
      <div className={styles.wrapper}>
          <h1>Message preview</h1>
          <div className={styles.content}>{finalTemplate}</div>
          <h2>Variables:</h2>
          <div className={styles.variablesBlock}>
              {variables.map((variable, index) => (
                  <div key={index} className={styles.inputBlock} >
                      <div>{variable}</div>
                      <input type="text" className={styles.input} onChange={(e) => onVariableChange(e.currentTarget?.value, variable)}/>
                  </div>
              ))}
          </div>

          <button onClick={onClick} className={styles.btn}>Close</button>
      </div>

  </div>
}

export default PreviewModal
