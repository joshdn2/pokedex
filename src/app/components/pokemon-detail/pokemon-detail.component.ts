import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonBasicData } from '../../services/interfaces/pokemon.interfaces';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pokemon-detail" *ngIf="pokemon">
      <h1>{{pokemon.name | titlecase}}</h1>
      <img [src]="pokemon.imageUrl" [alt]="pokemon.name">
      <div class="types">
        <span class="type" *ngFor="let type of pokemon.types">
          {{type}}
        </span>
      </div>
      <div class="info">
        <p>Pokédex Number: #{{pokemon.id.toString().padStart(3, '0')}}</p>
      </div>
    </div>
  `,
  styles: [`
    .pokemon-detail {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1rem;
      text-align: center;
    }
    
    img {
      max-width: 300px;
      height: auto;
    }

    .types {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 1rem 0;
    }

    .type {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      text-transform: capitalize;
      background: #eee;
    }
  `]
})
export class PokemonDetailComponent implements OnInit {
  pokemon: PokemonBasicData | null = null;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pokemonService.getPokemonById(id).subscribe(pokemon => {
      this.pokemon = pokemon;
    });
  }
} 