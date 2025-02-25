import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonBasicData, PokemonDetailData } from '../../services/interfaces/pokemon.interfaces';
import { PokemonTypeComponent } from '../pokemon-type/pokemon-type.component';
import { PokemonEvolutionComponent } from '../pokemon-evolution/pokemon-evolution.component';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    CommonModule,
    PokemonTypeComponent,
    PokemonEvolutionComponent
  ],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  pokemon: PokemonDetailData | null = null;
  prevPokemon: PokemonBasicData | null = null;
  nextPokemon: PokemonBasicData | null = null;
  loading = false;
  evolutionLoading = true;
  evolutionChain: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const name = params['name'];
      this.loadPokemon(name);
    });
  }

  private loadPokemon(name: string) {
    this.loading = true;
    this.evolutionLoading = true;
    this.pokemonService.getPokemonByName(name).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        this.pokemonService.getEvolutionChain(pokemon.species.url).subscribe({
          next: chain => {
            this.evolutionChain = chain;
            this.evolutionLoading = false;
          },
          error: () => {
            this.evolutionLoading = false;
          }
        });
        this.pokemonService.getAdjacentPokemon(pokemon.id).subscribe(adjacent => {
          this.prevPokemon = adjacent.prev;
          this.nextPokemon = adjacent.next;
          this.loading = false;
        });
      },
      error: (error) => {
        console.error('Error loading pokemon:', error);
        this.loading = false;
      }
    });
  }

  navigateToPokemon(pokemon: PokemonBasicData) {
    this.router.navigate(['/pokemon', pokemon.name.toLowerCase()]);
  }

  getStatColor(value: number): string {
    if (value < 30) return '#FF4444';  // Red
    if (value < 60) return '#FFA044';  // Orange
    if (value < 90) return '#FFD700';  // Yellow
    if (value < 120) return '#ADFF2F'; // Green-Yellow
    if (value < 150) return '#00A36C'; // Emerald Green
    return '#20B2AA';                  // Blue-Green
  }

  backToList() {
    this.router.navigate(['/']);
  }

  getTotalStats(): number {
    const stats = this.pokemon?.stats;
    return stats ? 
      stats.hp + 
      stats.attack + 
      stats.defense + 
      stats.specialAttack + 
      stats.specialDefense + 
      stats.speed 
      : 0;
  }

  getStatPercentage(value: number): number {
    // If any stat is over 180, use 255 as the max for all stats
    const useHighScale = Object.values(this.pokemon!.stats).some(stat => stat > 180);
    const maxValue = useHighScale ? 255 : 180;
    return (value / maxValue) * 100;
  }
} 