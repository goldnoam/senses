
export enum SenseId {
  SIGHT = 'sight',
  HEARING = 'hearing',
  SMELL = 'smell',
  TASTE = 'taste',
  TOUCH = 'touch'
}

export interface Example {
  title: string;
  description: string;
  imageUrls: string[]; // Changed to support multiple images
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
  printableId?: string; // Link to a worksheet
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  correctSenseId: SenseId;
  options: { id: SenseId; label: string }[];
}
