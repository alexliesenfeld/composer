export function trySilently<T>(operation: () => T) {
    try {
        return operation();
    } catch(err) {
        console.log("Error was explicitrly ignored: " + err)
    }
}
