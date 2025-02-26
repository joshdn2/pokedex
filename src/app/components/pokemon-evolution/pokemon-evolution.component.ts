import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonTypeComponent } from '../pokemon-type/pokemon-type.component';

interface PokemonEvolution {
  name: string;
  id: number;
  imageUrl: string;
  types: string[];
  evolutionText?: string;
  evolvesFrom?: string;
}

@Component({
  selector: 'app-pokemon-evolution',
  standalone: true,
  imports: [CommonModule, RouterModule, PokemonTypeComponent],
  templateUrl: './pokemon-evolution.component.html',
  styleUrls: ['./pokemon-evolution.component.css']
})
export class PokemonEvolutionComponent {
  @Input() evolutionChain: PokemonEvolution[] = [];
  @Input() pokemonName: string = '';
  @Input() loading: boolean = true;

  ngOnChanges() {}

  get hasEvolutions(): boolean {
    return this.evolutionChain.length > 1;
  }

  get isBranching(): boolean {
    if (!this.evolutionChain?.length) return false;
    return this.evolutionStages.some(stage => stage.length > 1);
  }

  get evolutionStages(): any[][] {
    if (!this.evolutionChain?.length) return [];

    const stages: any[][] = [];
    const baseForm = this.evolutionChain[0];

    // Group evolutions by what they evolve from
    this.evolutionChain.slice(1).forEach(pokemon => {
      const fromPokemon = pokemon.evolvesFrom;
      const stageIndex = this.evolutionChain.findIndex(p => p.name === fromPokemon);
      
      if (!stages[stageIndex]) {
        stages[stageIndex] = [];
      }
      stages[stageIndex].push(pokemon);
    });

    return stages;
  }

  /**
   * Gets the evolutions for a specific Pokemon
   * Returns an array of Pokemon that evolve directly from the given Pokemon
   */
  getEvolutionsFor(pokemonName: string): PokemonEvolution[] {
    return this.evolutionChain.filter(pokemon => 
      pokemon.evolvesFrom === pokemonName
    ) || [];
  }

  /**
   * Checks if a specific Pokemon has multiple evolutions
   */
  hasBranchingEvolutions(pokemonName: string): boolean {
    return this.getEvolutionsFor(pokemonName).length > 1;
  }

  /**
   * Gets the next Pokemon in a linear evolution
   */
  getNextEvolution(pokemonName: string): PokemonEvolution | null {
    const evolutions = this.getEvolutionsFor(pokemonName);
    return evolutions.length === 1 ? evolutions[0] : null;
  }
} 