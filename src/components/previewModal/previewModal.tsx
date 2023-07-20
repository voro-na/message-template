import React, { useEffect, useState } from "react";

import generateTemplateStore from "../../store/generateTemplateStore";
import styles from './previewModal.module.scss';

interface PreviewModalProps {
    onClick: () => void,
    variables: string[],
    template: string[][]
}

const PreviewModal = ({onClick, variables, template}: PreviewModalProps) => {
    const [finalTemplate, setFinalTemplate] = useState('')

    // useEffect to initialize the component
    useEffect(() =>{
        onVariableChange('', variables[0])
        generateTemplateStore.setInitialState(variables, template)
    }, [])

    // Function to handle changes in variables' values
    const onVariableChange = (value: string, variable: string) =>{
        setFinalTemplate(generateTemplateStore.generateFinalTemplate(value, variable))
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
