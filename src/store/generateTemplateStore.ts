import {makeAutoObservable} from "mobx";

class GenerateTemplateStore {
    constructor() {
        makeAutoObservable(this)
    }

    finalTemplate = ''
    variables: string[] = []
    template: string[][] = []
    valueOfVariables: Record<string, string> = {}

    // Sets the initial state of the store with variables and the template
    setInitialState(variables: string[], template: string[][]) {
        this.template = template
        this.variables = variables
        this.valueOfVariables = variables.reduce((o, key) => ({...o, [key]: ''}), {})
    }

    // Generates the final template by replacing variable placeholders with their values
    generateFinalTemplate(value: string, variable: string) {
        this.valueOfVariables[variable] = value
        const thenArr = [], elseArr = []
        this.finalTemplate = ''
        for (let i = 0; i < this.template.length; i++) {
            let newStr = this.template[i][0]

            // Replaces all occurrences of variable placeholders with their values
            for (const v in this.valueOfVariables) {
                newStr = newStr.replaceAll(`{${v}}`, this.valueOfVariables[v])
            }
            if (this.template[i].length > 1) {

                const condition = this.template[i][1]
                const id = this.template[i][2]

                if (condition === 'if' && newStr.length > 0) {
                    thenArr.push(id)
                    //this.finalTemplate += newStr + ' '
                } else if (condition === 'if' && newStr.length === 0) {
                    elseArr.push(id)
                    //this.finalTemplate += newStr + ' '
                } else if (condition === 'then' && thenArr.indexOf(String(Number(id) - 1)) !== -1) {
                    this.finalTemplate += newStr + ' '
                } else if (condition === 'else' && elseArr.indexOf(String(Number(id) - 2)) !== -1) {
                    this.finalTemplate += newStr + ' '
                }
            } else {
                this.finalTemplate += newStr + ' '
            }
        }
        return this.finalTemplate
    }
}

export default new GenerateTemplateStore()
