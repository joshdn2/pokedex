import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeEffectivenessService {
  private baseUrl = 'https://pokeapi.co/api/v2';
  private typeCache: { [key: string]: any } = {};

  constructor(private http: HttpClient) {}

  async getTypeEffectiveness(types: string[]): Promise<{ [key: string]: number }> {
    const typeRequests = types.map(type => 
      this.getTypeData(type.toLowerCase())
    );

    const typeData = await Promise.all(typeRequests);
    const effectiveness: { [key: string]: number } = {};

    // Initialize all types with neutral effectiveness
    const allTypes = [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
      'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];
    allTypes.forEach(type => effectiveness[type] = 1);

    // Process damage relations for each defending type
    typeData.forEach(data => {
      // Double damage from
      data.damage_relations.double_damage_from.forEach((type: any) => {
        effectiveness[type.name] *= 2;
      });

      // Half damage from
      data.damage_relations.half_damage_from.forEach((type: any) => {
        effectiveness[type.name] *= 0.5;
      });

      // No damage from
      data.damage_relations.no_damage_from.forEach((type: any) => {
        effectiveness[type.name] = 0;
      });
    });

    return effectiveness;
  }

  private async getTypeData(type: string): Promise<any> {
    if (this.typeCache[type]) {
      return this.typeCache[type];
    }

    const response = await fetch(`${this.baseUrl}/type/${type}`);
    const data = await response.json();
    this.typeCache[type] = data;
    return data;
  }

  getEffectivenessLabel(value: number): string {
    if (value === 0) return '0';
    if (value === 0.25) return '¼';
    if (value === 0.5) return '½';
    if (value === 2) return '2';
    if (value === 4) return '4';
    if (value === 1) return '1';
    return '';  // for neutral (1x)
  }
} 