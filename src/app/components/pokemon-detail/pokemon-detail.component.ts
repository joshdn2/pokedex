import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonBasicData, PokemonDetailData } from '../../services/interfaces/pokemon.interfaces';
import { PokemonTypeComponent } from '../pokemon-type/pokemon-type.component';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    CommonModule,
    PokemonTypeComponent
  ],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  pokemon: PokemonDetailData | null = null;
  prevPokemon: PokemonBasicData | null = null;
  nextPokemon: PokemonBasicData | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadPokemon(id);
    });
  }

  private loadPokemon(id: number) {
    this.loading = true;
    this.pokemonService.getPokemonById(id).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
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

  navigateToPokemon(id: number) {
    this.router.navigate(['/pokemon', id]);
  }

  getStatColor(value: number): string {
    if (value < 30) return '#FF4444';  // Red
    if (value < 60) return '#FFA044';  // Orange
    if (value < 90) return '#FFD700';  // Yellow
    if (value < 120) return '#ADFF2F'; // Green-Yellow
    if (value < 150) return '#00A36C'; // Emerald Green
    return '#20B2AA';                  // Blue-Green
  }
} 