class CustomFormatter {
    constructor() {
        this.errors = [];
    }

    addError(message, field) {
        const existingField = this.errors.find((error) => {
            return error.field === field;
        });

        if (!existingField) {
            this.errors.push({ message, field });
        }
    }

    toJSON() {
        return this.errors.length ? this.errors : null;
    }
}

export default CustomFormatter;
