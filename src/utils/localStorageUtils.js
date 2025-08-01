export function dedupe(arr, uniqueKeys) {
    return arr.filter((item, index, self) => {
      return (
        self.findIndex(other =>
          uniqueKeys.every(k => other[k] === item[k])
        ) === index
      );
    });
  }