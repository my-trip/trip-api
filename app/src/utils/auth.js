import {getStorageItem} from './storage'

export const  isLogged = () => {
    return typeof localStorage !== 'undefined' && getStorageItem('token');
}