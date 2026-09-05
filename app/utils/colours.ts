function weightedShuffle(arr: { value: string, weight: number }[]) {
    for (let i = 0; i < arr.length; i++) {
        const v = weightedIndexChoice(arr.slice(i));
        [arr[i + v], arr[i]] = [arr[i], arr[i + v]];
    }
    return arr;
}
function weightedIndexChoice(arr: { value: string, weight: number }[]): number {
    const totalWeight = arr.map(v => v.weight).reduce((x, y) => x + y);
    const val = Math.random() * totalWeight;
    for (let i = 0, cur = 0; ; i++) {
        cur += arr[i].weight;
        if (val <= cur) return i;
    }
}

export const colours = weightedShuffle([{ value: '#BA81C5', weight: 10 }, { value: '#A0C35A', weight: 5 }, { value: '#B0C4EF', weight: 1 }, { value: '#F9DF6D', weight: 1 }])
