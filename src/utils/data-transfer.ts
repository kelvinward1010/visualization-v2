type ColumnMap = {
    [key: string]: string;
};

export function moveColumnsOfData<T extends Record<string, any>>(
    input: T[],
    columns: ColumnMap,
): Array<{ [key: string]: any }> {
    if (!Array.isArray(input)) {
        return [];
    }

    return input.map((item) => {
        const result: { [key: string]: any } = {};
        for (const key in columns) {
            result[key] = item[columns[key]];
        }
        return result;
    });
}
