import {getStorageItem} from './storage'

export const  isLogged = () => {
    console.log("EITA")
    return typeof localStorage !== 'undefined' && getStorageItem('token');
}