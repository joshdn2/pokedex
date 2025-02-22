import { Injectable } from '@angular/core';
import { SortOptionConfig } from './interfaces/filter.interfaces';
import { GenerationConfig } from './interfaces/pokemon.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PokemonDataService {
  readonly GENERATIONS: GenerationConfig[] = [
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

  readonly TYPES = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison',
    'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dark', 'dragon',
    'steel', 'fairy'
  ];

  readonly SORT_OPTIONS: SortOptionConfig[] = [
    { value: 'number', label: 'Number' },
    { value: 'name', label: 'Name' }
  ];

  getGenerationByPokemonId(id: number): GenerationConfig | undefined {
    return this.GENERATIONS.find(gen => id >= gen.startId && id <= gen.endId);
  }
} 