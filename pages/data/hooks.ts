import Fuse from 'fuse.js';
import { useState } from 'react';

export function useFuzzySearch<T>(items: T[], options: Fuse.IFuseOptions<T>) {
  const [filteredResults, setFilteredResults] = useState<T[]>();

  const search = (keyWord: string) => {
    if (keyWord === '') {
      setFilteredResults(undefined);
    }

    const fuse = new Fuse(items, options);
    const result = fuse.search(keyWord);

    setFilteredResults(result.map(({ item }) => item));

    return result;
  };

  const clear = () => {
    setFilteredResults(undefined);
  };

  return {
    filteredResults,
    search,
    clear,
  };
}

export default useFuzzySearch;
