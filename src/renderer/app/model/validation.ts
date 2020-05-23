
export class ValidationErrors<T> {
    errors = new Map<T, string[]>();

    add(key: T, error: string) {
        if (!this.errors.has(key)) {
            this.errors.set(key, []);
        }
        this.errors.get(key)!.push(error);
    }

    hasErrors() {
        return this.errors.size > 0;
    }
}
