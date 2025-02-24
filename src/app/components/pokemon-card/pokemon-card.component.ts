import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PokemonBasicData } from '../../services/interfaces/pokemon.interfaces';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css']
})
export class PokemonCardComponent {
  @Input() pokemon!: PokemonBasicData;

  constructor(private router: Router) {}

  navigateToDetail() {
    console.log('Navigating to pokemon:', this.pokemon.id);
    this.router.navigate(['/pokemon', this.pokemon.id]);
  }
} 