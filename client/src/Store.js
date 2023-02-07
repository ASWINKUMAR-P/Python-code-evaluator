import { createContext,useReducer } from "react";

export const Store= createContext();

const intialState={
       userInfo:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):null
}

function reducer(state,action)
{
     console.log(action.payload);
    switch(action.type){
        case 'ADD_USERINFO':
            return{...state,userInfo:action.payload}
            // return{...state,user:{...state.user,
            //     userInfo:[...state.user.userInfo,action.payload]}}
    }

    switch(action.type)
    {
        case 'DELETE_USERINFO':
            return{
                ...state,
                userInfo:null
            }
    }
}


export function StoreProvider(props){
    const[state,dispatch]=useReducer(reducer,intialState);
    const value={state,dispatch};
    return <Store.Provider value={value} >{props.children}</Store.Provider>
}
