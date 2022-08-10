const STORAGE_NAME = "MY_TRIP"

export const setStorageItem = (key, value) => {
    if (typeof localStorage != undefined) {
        localStorage.setItem(`${STORAGE_NAME}_${key}`, value)
    }
}

export const getStorageItem = (key) => {
    if (typeof localStorage != undefined) {
        return localStorage.getItem(`${STORAGE_NAME}_${key}`)
    }
    return null
}

export const deleteStorageItem = (key) => {
    if (typeof localStorage != undefined) {
        localStorage.removeItem(`${STORAGE_NAME}_${key}`)
    }
}
