function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export const withRetry = async <T>(fn: () => Promise<T>, interval: number, retries: number) => {
    let lastError = undefined;
    for (let retry = 0; retry < retries; retry++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            await sleep(interval);
        }
    }

    throw lastError;
};
