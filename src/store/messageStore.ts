import {makeAutoObservable} from 'mobx'

interface state {
    parent: string,
    value: string,
    children: string[] | undefined,
    id: string,
    condition: string,
    level: number
}

class MessageStore {

    messages: Record<string, state> = {
        '0': {
            parent: '',
            id: '0',
            value: '',
            children: ['1'],
            condition: '',
            level: 0
        },
        '1': {
            parent: '0',
            id: '1',
            value: '',
            children: undefined,
            condition: '',
            level: 0
        }
    }

    constructor() {
        makeAutoObservable(this)
    }

    setValue(id: string, value: string) {
        this.messages[id].value = value
    }

    addChildren(children: string[], id: string) {

        let childrenCurrent = this.messages[id].children
        if (childrenCurrent) {
            this.messages[id].children = [...childrenCurrent, ...children]
        } else {
            this.messages[id].children = children
        }
    }

    addChild(child: string, afterElem: string, id: string) {
        let index = this.messages[id].children?.indexOf(afterElem) ?? 0
        //console.log(index)
        let arr = this.messages[id].children ?? []
        this.messages[id].children = [...arr.slice(0, index + 1), child, ...arr.slice(index + 1, arr.length)]
    }

    deleteGroup(id: string) {
        let parentId = this.messages[id].parent
        let children = this.messages[parentId].children ?? []
        let nextInputId = String(Number(children.at(-1)) + 1)
        //console.log(JSON.stringify(children))
        while (children.length > 0) {
            let childId = children.pop()
            if (childId && this.messages[childId].children) {
                let addChildren = this.messages[childId].children ?? []
                children = [...children, ...addChildren]
            }
            if (childId) {
                delete this.messages[childId]
            }
            this.messages[parentId].children = this.messages[parentId].children?.filter(item => item !== childId)
        }

        if (this.messages[nextInputId].children) {
            let nextChildren = this.messages[nextInputId].children ?? []
            for (let child of nextChildren) {
                this.messages[child].parent = parentId
                this.messages[parentId].children?.push(child)
            }

        }

        if (this.messages[nextInputId]) {
            let nextInputIdParent = this.messages[parentId].parent

            this.messages[parentId].value = this.messages[parentId].value + this.messages[nextInputId].value
            delete this.messages[nextInputId]
            this.messages[nextInputIdParent].children = this.messages[nextInputIdParent].children?.filter(item => item !== nextInputId)
        }

        //console.log(JSON.stringify(this.messages))
    }

    addNewMsg(condition: string, id: string, parentId: string, level: number) {
        let obj = {
            parent: parentId,
            value: '',
            children: undefined,
            condition: '',
            id: '',
            level: level
        }
        this.messages[id] = {...obj}
        this.messages[id].id = id
        this.messages[id].parent = parentId
        this.messages[id].condition = condition
    }

    generateFinalMsg() {
        let message = ''

        let dfs = (id: string) => {

            switch (this.messages[id].condition) {
                case 'if':
                    message += ' ${ "' + this.messages[id].value + '"'
                    break
                case 'then':
                    message += ' ? "' + this.messages[id].value + '" : '
                    break
                case 'else':
                    message += '"' + this.messages[id].value + '" } '
                    break
                default:
                    message += this.messages[id].value
                    break

            }
            let children = this.messages[id].children ?? []

            for (let childId of children) {
                dfs(childId)
            }
        }
        dfs('0')
        return message
    }

    generateFinalMsg2() {
        let message: string[][] = []

        let dfs = (id: string) => {
            if (this.messages[id].condition !== '') {
                message.push([this.messages[id].value, this.messages[id].condition, this.messages[id].id])
            }else{
                message.push([this.messages[id].value])
            }

            let children = this.messages[id].children ?? []

            for (let childId of children) {
                dfs(childId)
            }
        }
        dfs('0')
        return message
    }
}

export default new MessageStore()
