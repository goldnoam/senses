
export enum SenseId {
  SIGHT = 'sight',
  HEARING = 'hearing',
  SMELL = 'smell',
  TASTE = 'taste',
  TOUCH = 'touch'
}

export type FontSize = 's' | 'm' | 'l';

export interface Example {
  title: string;
  description: string;
  imageUrls: string[];
}

export interface SenseData {
  id: SenseId;
  name: string;
  organ: string;
  description: string;
  color: string;
  icon: string;
  imageUrl: string;
  examples: Example[];
  printableId?: string;
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  correctSenseId: SenseId;
  options: { id: SenseId; label: string }[];
}
