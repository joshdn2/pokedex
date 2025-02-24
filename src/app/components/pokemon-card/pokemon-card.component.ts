import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PokemonBasicData } from '../../services/interfaces/pokemon.interfaces';
import { PokemonTypeComponent } from '../pokemon-type/pokemon-type.component';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [
    CommonModule,
    PokemonTypeComponent
  ],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css']
})
export class PokemonCardComponent {
  @Input() pokemon!: PokemonBasicData;

  constructor(private router: Router) {}

  navigateToDetail() {
    this.router.navigate(['/pokemon', this.pokemon.name.toLowerCase()]);
  }
} 