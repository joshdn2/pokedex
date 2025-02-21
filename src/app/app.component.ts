import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PokemonListComponent],
  template: `
    <h1>Pokédex</h1>
    <app-pokemon-list></app-pokemon-list>
  `
})
export class AppComponent {}
