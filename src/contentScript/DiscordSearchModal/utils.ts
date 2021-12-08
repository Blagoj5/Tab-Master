/* eslint-disable import/prefer-default-export */
import Fuse from 'fuse.js';
import { CommonTab } from '../../common';

export function fuzzySearch<T>(
  items: T[],
  options: Fuse.IFuseOptions<T>,
  keyWord: string,
): T[] {
  if (keyWord === '') return items;

  const fuse = new Fuse(items, options);
  const result = fuse.search(keyWord);

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

export const getFavicon = (url: string) => {
  const urlObject = new URL(url);
  return `https://${urlObject.hostname}/favicon.ico`;
};
