import checkToken from "./testToken";


export default async function checkLogin(callback?: () => void, onfailure?: () => void) {
const isValid = await checkToken()
    if (isValid) {
        if (callback)
            callback(); // Appel de la fonction de rappel si le token est valide 
    }
    if(!isValid) {
        if (onfailure)
            onfailure();
    }
}
