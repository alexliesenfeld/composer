export function trySilently<T>(operation: () => T) {
    try {
        return operation();
    } catch (err) {
        console.log('Error was explicitly ignored: ' + err);
    }
}
