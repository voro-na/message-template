import {makeAutoObservable} from 'mobx'

import {state} from "../types";

class MessageStore {

    messages: Record<string, state> = {
        '0': {
            parent: '',
            id: '0',
            value: '',
            children: ['1'], //children unique Id
            condition: '',
            level: 0 // Level of the message in the tree hierarchy
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

    // Method to set the value of a message by its ID
    setValue(id: string, value: string) {
        this.messages[id].value = value
    }

    // Method to add children messages to a parent message
    addChildrenMessages(children: string[], id: string) {

        const childrenCurrent = this.messages[id].children
        if (childrenCurrent) {
            this.messages[id].children = [...childrenCurrent, ...children]
        } else {
            this.messages[id].children = children
        }
    }

    // Method to add a child message after a specific element in the parent's children list
    addChildMessages(child: string, afterElem: string, id: string) {
        const index = this.messages[id].children?.indexOf(afterElem) ?? 0
        const arr = this.messages[id].children ?? []
        this.messages[id].children = [...arr.slice(0, index + 1), child, ...arr.slice(index + 1, arr.length)]
    }

    // Method to delete a group of messages starting from a specified ID
    deleteGroupMessages(id: string) {
        const parentId = this.messages[id].parent
        let children = this.messages[parentId].children ?? []
        const nextInputId = String(Number(children.at(-1)) + 1)

        while (children.length > 0) {
            const childId = children.pop()
            if (childId && this.messages[childId].children) {
                const addChildren = this.messages[childId].children ?? []
                children = [...children, ...addChildren]
            }
            if (childId) {
                delete this.messages[childId]
            }
            this.messages[parentId].children = this.messages[parentId].children?.filter(item => item !== childId)
        }

        if (this.messages[nextInputId].children) {
            const nextChildren = this.messages[nextInputId].children ?? []
            for (const child of nextChildren) {
                this.messages[child].parent = parentId
                this.messages[parentId].children?.push(child)
            }
        }

        if (this.messages[nextInputId]) {
            const nextInputIdParent = this.messages[parentId].parent

            this.messages[parentId].value = this.messages[parentId].value + this.messages[nextInputId].value
            delete this.messages[nextInputId]
            this.messages[nextInputIdParent].children = this.messages[nextInputIdParent].children?.filter(item => item !== nextInputId)
        }
    }

    // Method to add a new message with the given condition, ID, parent ID, and level
    addNewMsg(condition: string, id: string, parentId: string, level: number) {
        const obj = {
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

    // Method to generate the final message as a 2D array using Depth-First Search (DFS)
    generateFinalMsg() {
        const message: string[][] = []

        const dfs = (id: string) => {
            if (this.messages[id].condition !== '') {
                message.push([this.messages[id].value, this.messages[id].condition, this.messages[id].id])
            } else {
                message.push([this.messages[id].value])
            }

            const children = this.messages[id].children ?? []

            for (const childId of children) {
                dfs(childId)
            }
        }
        dfs('0')
        return message
    }
}

export default new MessageStore()
