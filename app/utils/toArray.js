



export function toArray(x) {
    return x == null ? [] : Array.isArray(x) ? x : [x];
  }