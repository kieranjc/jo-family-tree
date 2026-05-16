import { describe, it, expect } from 'vitest';
import { BY_ID } from '../data/tree.js';
import { searchResultMeta } from './search.js';

describe('searchResultMeta', () => {
  it('differentiates two people named Matthew Daly', () => {
    const brother = BY_ID.matthew;
    const greatUncle = BY_ID.gunc_matthew_daly;
    expect(searchResultMeta(brother)).toMatch(/Joanne's generation/);
    expect(searchResultMeta(brother)).toMatch(/b\. 1987/);
    expect(searchResultMeta(greatUncle)).toMatch(/Grandparents/);
    expect(searchResultMeta(greatUncle)).toMatch(/b\. 9 Jun 1896/);
  });
});
