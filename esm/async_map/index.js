export async function asyncMap(arr, fn) {
    let results = [];
    for(let i = 0; i < arr.length; ++i)results.push(await fn(arr[i], i));
    return results;
}
