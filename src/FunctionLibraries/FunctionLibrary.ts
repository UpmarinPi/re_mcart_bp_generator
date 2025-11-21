export function ReverseMap(toReverseMap: Map<any, any>): Map<any, any> {
    return Object.fromEntries(Object.entries(toReverseMap).map(a => a.reverse()));
}
