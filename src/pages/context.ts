import React from 'react';
interface state {
    parent: null |string ,
    value: string,
    child: string[] | null,
    id: string,
    condition: string
}
const obj:Record<string, state> ={
    0:{
        parent: null,
        id: '0',
        value: '',
        child: null,
        condition: ''
    }
}

export const InputContext = React.createContext<Record<string, state>>(obj);

