type CsvRow = Record<string, any>;

const newLine = /\r?\n/;
const fieldDelimiter = ",";

export function convertCsvToJson(parsedCsv: string): CsvRow[] {
    try {
        const lines = parsedCsv.split(newLine);
        const headers = lines[0].split(fieldDelimiter);
        const jsonResult: CsvRow[] = [];

        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(fieldDelimiter);
            if (hasContent(currentLine)) {
                jsonResult.push(buildJsonResult(headers, currentLine));
            }
        }

        return jsonResult;
    } catch (e) {
        throw new Error("is not file csv");
    }
}

function hasContent(values: string[]): boolean {
    return values.some((value) => value.trim() !== "");
}

function buildJsonResult(headers: string[], currentLine: string[]): CsvRow {
    const jsonObject: CsvRow = {};

    for (let j = 0; j < headers.length; j++) {
        const propertyName = String(headers[j]).trim();
        const value = currentLine[j];
        jsonObject[propertyName] = value;
    }

    return jsonObject;
}
