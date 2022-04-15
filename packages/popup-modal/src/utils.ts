/* eslint-disable import/prefer-default-export */
import Fuse from 'fuse.js';
import { CommonTab } from '@tab-master/common/build/types';

export function fuzzySearch<T>(
  items: T[],
  options: Fuse.IFuseOptions<T>,
  keyWord: string | Fuse.Expression,
  // eslint-disable-next-line no-unused-vars
  onSearchDone?: (result: Fuse.FuseResult<T>[]) => Fuse.FuseResult<T>[],
): T[] {
  if (keyWord === '') return items;

  const fuse = new Fuse(items, options);
  let result = fuse.search(keyWord);

  if (onSearchDone) {
    result = onSearchDone?.(result) || result;
    result = result.sort(
      (a, b) => {
        if (a.score === undefined || b.score === undefined) return 0;
        if (a.score === b.score) {
          return a.refIndex < b.refIndex ? -1 : 1;
        }

        return a.score < b.score ? -1 : 1;
      },
    );
  }

  return result.map(({ item }) => item);
}

export function removeDuplicates<T extends CommonTab>(
  items: T[],
): T[] {
  const seen: Record<string, unknown> = {};
  return items.filter((item) => {
    const itemDoesNotExist = (!seen[item.id] && !seen[item.url]);

    if (itemDoesNotExist) {
      seen[item.id] = item.id;
      seen[item.url] = item.url;
      return true;
    }

    return false;
  });
}

export const getFaviconURL = (url: string) => {
  const urlObject = new URL(url);
  return `https://${urlObject.hostname}/favicon.ico`;
};
