export interface FilterState {
  searchTerm: string;
  selectedTypes: string[];
  selectedGeneration: number | null;
  sortBy: SortOption;
}

export type SortOption = 'number' | 'name'; 