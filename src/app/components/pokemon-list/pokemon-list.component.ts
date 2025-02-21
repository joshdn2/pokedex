import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonBasicData, PokemonGeneration } from '../../services/interfaces/pokemon.interfaces';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, PokemonCardComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemonByGen: PokemonGeneration[] = [];
  loading = false;
  offset = 0;
  limit = 100;
  allLoaded = false;

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
    this.loadPokemon();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.loading || this.allLoaded) return;

    // Calculate current scroll position and total height
    const scrollPosition = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Load more when we're halfway through (50% of total scroll height)
    if (scrollPosition > totalHeight * 0.5) {
      this.loadPokemon();
    }
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

  loadPokemon() {
    if (this.loading || this.allLoaded) return;

    this.loading = true;
    this.pokemonService.getPokemonPage(this.offset, this.limit).subscribe({
      next: (newPokemon) => {
        if (newPokemon.length < this.limit) {
          this.allLoaded = true;
        }
        this.groupByGeneration(newPokemon);
        this.offset += this.limit;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading Pokemon:', error);
        this.loading = false;
      }
    });
  }
} 