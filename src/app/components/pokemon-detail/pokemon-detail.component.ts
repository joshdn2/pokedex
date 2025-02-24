import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonBasicData } from '../../services/interfaces/pokemon.interfaces';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  pokemon: PokemonBasicData | null = null;
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
        const adjacent = this.pokemonService.getAdjacentPokemon(pokemon.id);
        this.prevPokemon = adjacent.prev;
        this.nextPokemon = adjacent.next;
        this.loading = false;
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
} 