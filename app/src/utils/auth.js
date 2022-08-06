export const  isLogged = () => {
    return typeof localStorage !== 'undefined' && localStorage.getItem('token');
}