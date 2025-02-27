import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonDetailData } from '../../services/interfaces/pokemon.interfaces';
import { PokemonTypeComponent } from '../pokemon-type/pokemon-type.component';

@Component({
  selector: 'app-pokemon-details-info',
  standalone: true,
  imports: [CommonModule, PokemonTypeComponent],
  templateUrl: './pokemon-details-info.component.html',
  styleUrls: ['./pokemon-details-info.component.css']
})
export class PokemonDetailsInfoComponent {
  @Input() pokemon!: PokemonDetailData;

  get sortedAbilities() {
    return [...this.pokemon.abilities].sort((a, b) => a.slot - b.slot);
  }

  formatHeight(height: number): string {
    const meters = height;
    const feet = Math.floor(meters * 3.28084);
    const inches = Math.round((meters * 3.28084 - feet) * 12);
    return `${meters} m (${feet}'${inches}")`;
  }

  formatWeight(weight: number): string {
    const kg = weight;
    const lbs = Math.round(kg * 2.20462 * 10) / 10;
    return `${kg} kg (${lbs} lbs)`;
  }

  formatAbilityName(name: string): string {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  formatGrowthRate(rate: string): string {
    return rate.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  formatEggGroups(groups: string[]): string {
    return groups.map(group => 
      group.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    ).join(', ');
  }

  calculateCatchPercent(): number {
    return Math.round((this.pokemon.catchRate / 255) * 100);
  }
}
