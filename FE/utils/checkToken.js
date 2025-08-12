
export function checkToken() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
        const isExpired = payload.exp * 1000 < Date.now();
        return !isExpired;
    } catch (error) {
        console.log(error)
        return false;
    }
}