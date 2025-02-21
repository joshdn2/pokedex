import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FilterState, SortOption } from '../../services/interfaces/filter.interfaces';

@Component({
  selector: 'app-filter-controls',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './filter-controls.component.html',
  styleUrls: ['./filter-controls.component.css']
})
export class FilterControlsComponent {
  @Output() filterChange = new EventEmitter<FilterState>();

  searchTerm = '';
  selectedTypes: string[] = [];
  selectedGeneration: number | null = null;
  sortBy: SortOption = 'number';

  readonly TYPES = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice', 
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
    'rock', 'ghost', 'dark', 'dragon', 'steel', 'fairy'
  ];

  readonly GENERATIONS = [
    { value: 1, label: 'Generation I - Kanto' },
    { value: 2, label: 'Generation II - Johto' },
    { value: 3, label: 'Generation III - Hoenn' },
    { value: 4, label: 'Generation IV - Sinnoh' },
    { value: 5, label: 'Generation V - Unova' },
    { value: 6, label: 'Generation VI - Kalos' },
    { value: 7, label: 'Generation VII - Alola' },
    { value: 8, label: 'Generation VIII - Galar' },
    { value: 9, label: 'Generation IX - Paldea' }
  ];

  readonly SORT_OPTIONS = [
    { value: 'number', label: 'Number' },
    { value: 'name', label: 'Name' }
  ];

  get hasActiveFilters(): boolean {
    return !!(this.searchTerm || 
              this.selectedTypes.length || 
              this.selectedGeneration || 
              this.sortBy !== 'number');
  }

  onFilterChange() {
    this.filterChange.emit({
      searchTerm: this.searchTerm,
      selectedTypes: this.selectedTypes,
      selectedGeneration: this.selectedGeneration,
      sortBy: this.sortBy
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedTypes = [];
    this.selectedGeneration = null;
    this.sortBy = 'number';
    this.onFilterChange();
  }
} 