import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { FilterControlsComponent } from '../filter-controls/filter-controls.component';
import { PokemonBasicData, PokemonGeneration } from '../../services/interfaces/pokemon.interfaces';
import { FilterState } from '../../services/interfaces/filter.interfaces';
import { BackToTopComponent } from '../back-to-top/back-to-top.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    PokemonCardComponent,
    FilterControlsComponent,
    BackToTopComponent
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemonByGen: PokemonGeneration[] = [];
  filteredPokemon: PokemonBasicData[] = [];
  displayedPokemon: PokemonBasicData[] = [];
  loading = true;
  displayLimit = 100;
  displayOffset = 0;
  currentFilters: FilterState = {
    searchTerm: '',
    selectedTypes: [],
    selectedGeneration: null,
    sortBy: 'number'
  };

  readonly GENERATIONS = [
    { number: 1, name: 'Generation I - Kanto', startId: 1, endId: 151 },
    { number: 2, name: 'Generation II - Johto', startId: 152, endId: 251 },
    { number: 3, name: 'Generation III - Hoenn', startId: 252, endId: 386 },
    { number: 4, name: 'Generation IV - Sinnoh', startId: 387, endId: 493 },
    { number: 5, name: 'Generation V - Unova', startId: 494, endId: 649 },
    { number: 6, name: 'Generation VI - Kalos', startId: 650, endId: 721 },
    { number: 7, name: 'Generation VII - Alola', startId: 722, endId: 809 },
    { number: 8, name: 'Generation VIII - Galar', startId: 810, endId: 905 },
    { number: 9, name: 'Generation IX - Paldea', startId: 906, endId: 1010 }
  ];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.pokemonService.getLoadingStatus().subscribe(
      isLoading => this.loading = isLoading
    );

    this.pokemonService.getAllPokemon().subscribe(pokemon => {
      if (pokemon.length > 0) {
        this.applyFilters(pokemon);
        this.updateDisplayedPokemon();
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.loading) return;

    const scrollPosition = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (scrollPosition > totalHeight * 0.5) {
      this.loadMorePokemon();
    }
  }

  private loadMorePokemon() {
    const nextBatch = this.filteredPokemon.slice(
      this.displayOffset,
      this.displayOffset + this.displayLimit
    );
    
    if (nextBatch.length > 0) {
      this.displayOffset += this.displayLimit;
      this.groupByGeneration(nextBatch);
    }
  }

  handleFilterChange(filters: FilterState) {
    this.currentFilters = filters;
    this.pokemonService.getAllPokemon().pipe(take(1)).subscribe(pokemon => {
      this.applyFilters(pokemon);
      this.resetDisplay();
    });
  }

  private resetDisplay() {
    this.displayOffset = 0;
    this.pokemonByGen = [];
    this.updateDisplayedPokemon();
  }

  private updateDisplayedPokemon() {
    const initialBatch = this.filteredPokemon.slice(0, this.displayLimit);
    this.displayOffset = this.displayLimit;
    this.groupByGeneration(initialBatch);
  }

  private applyFilters(pokemon: PokemonBasicData[]) {
    let filtered = [...pokemon];

    if (this.currentFilters.searchTerm) {
      const searchTerm = this.currentFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm)
      );
    }

    if (this.currentFilters.selectedTypes.length > 0) {
      filtered = filtered.filter(pokemon =>
        this.currentFilters.selectedTypes.every(type =>
          pokemon.types.includes(type)
        )
      );
    }

    if (this.currentFilters.selectedGeneration) {
      const gen = this.GENERATIONS.find(g => 
        g.number === this.currentFilters.selectedGeneration
      );
      if (gen) {
        filtered = filtered.filter(pokemon =>
          pokemon.id >= gen.startId && pokemon.id <= gen.endId
        );
      }
    }

    filtered.sort((a, b) => {
      if (this.currentFilters.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.id - b.id;
    });

    this.filteredPokemon = filtered;
  }

  private groupByGeneration(pokemon: PokemonBasicData[]): void {
    pokemon.forEach(poke => {
      const generation = this.GENERATIONS.find(gen => 
        poke.id >= gen.startId && poke.id <= gen.endId
      );
      
      if (generation) {
        let genGroup = this.pokemonByGen.find(g => g.number === generation.number);
        if (!genGroup) {
          genGroup = {
            number: generation.number,
            name: generation.name,
            pokemon: []
          };
          this.pokemonByGen.push(genGroup);
          // Sort generations by number
          this.pokemonByGen.sort((a, b) => a.number - b.number);
        }
        genGroup.pokemon.push(poke);
      }
    });
  }
} 