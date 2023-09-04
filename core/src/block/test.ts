
export type NumericTypes = {
    BIT: { Conversion: number, Parameters: [number] }
    TINYINT: { Conversion: number, Parameters: [number] }
}

export type NumericType = keyof NumericTypes;

type Conversions = {
    [Key in keyof NumericTypes]: NumericTypes[Key]["Conversion"]
}

type Parameters = {
    [Key in keyof NumericTypes]: NumericTypes[Key]["Parameters"]
}
