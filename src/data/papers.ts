import { Paper, CategoryId } from '../types';
import { PAPERS_1_TO_6 } from './papers1to6';
import { PAPERS_7_TO_13 } from './papers7to13';
import { PAPERS_14_TO_22 } from './papers14to22';
import { PAPERS_23_TO_33 } from './papers23to33';
import { PAPERS_34_TO_42 } from './papers34to42';
import { PAPERS_43_TO_50 } from './papers43to50';

export const ALL_PAPERS: Paper[] = [
  ...PAPERS_1_TO_6,
  ...PAPERS_7_TO_13,
  ...PAPERS_14_TO_22,
  ...PAPERS_23_TO_33,
  ...PAPERS_34_TO_42,
  ...PAPERS_43_TO_50,
];

export function getPaperById(id: string): Paper | undefined {
  return ALL_PAPERS.find((p) => p.id === id);
}

export function getPaperByNumber(num: number): Paper | undefined {
  return ALL_PAPERS.find((p) => p.number === num);
}

export function getPapersByCategory(categoryId: CategoryId): Paper[] {
  return ALL_PAPERS.filter((p) => p.category === categoryId);
}
