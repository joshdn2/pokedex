import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin, throwError } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { 
  PokemonBasicData, 
  PokemonDetailData, 
  PokemonListResponse, 
  PokemonApiResponse,
  PokemonSpeciesApiResponse
} from './interfaces/pokemon.interfaces';

interface EvolutionNode {
  species: {
    name: string;
  };
  evolution_details: any[];
  evolves_to: EvolutionNode[];
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';
  private cachedPokemon: PokemonBasicData[] = [];

  constructor(private http: HttpClient) {}

  getAllPokemon(): Observable<PokemonBasicData[]> {
    if (this.cachedPokemon.length > 0) {
      return of(this.cachedPokemon);
    }

    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=1010`).pipe(
      switchMap(response => {
        const detailRequests = response.results.map(pokemon => 
          this.http.get<PokemonApiResponse>(pokemon.url)
        );
        return forkJoin(detailRequests);
      }),
      map(pokemonDetails => {
        this.cachedPokemon = pokemonDetails.map(details => this.transformBasicData(details));
        return this.cachedPokemon;
      })
    );
  }

  getPokemonById(id: number): Observable<PokemonDetailData> {
    return this.http.get<PokemonApiResponse>(`${this.baseUrl}/pokemon/${id}`).pipe(
      switchMap(pokemonData => {
        return this.http.get<PokemonSpeciesApiResponse>(pokemonData.species.url).pipe(
          map(speciesData => this.transformDetailedData(pokemonData, speciesData))
        );
      }),
      catchError(error => {
        console.error('Error fetching Pokemon details:', error);
        return throwError(() => error);
      })
    );
  }

  getPokemonByName(name: string): Observable<PokemonDetailData> {
    return this.http.get<PokemonApiResponse>(`${this.baseUrl}/pokemon/${name.toLowerCase()}`).pipe(
      switchMap(pokemonData => {
        return this.http.get<PokemonSpeciesApiResponse>(pokemonData.species.url).pipe(
          map(speciesData => this.transformDetailedData(pokemonData, speciesData))
        );
      }),
      catchError(error => {
        console.error('Error fetching Pokemon details:', error);
        return throwError(() => error);
      })
    );
  }

  private transformBasicData(details: PokemonApiResponse): PokemonBasicData {
    return {
      id: details.id,
      name: details.name,
      types: details.types.map(t => t.type.name),
      imageUrl: details.sprites.other['official-artwork'].front_default,
      pixelSprite: details.sprites.front_default,
      generation: this.getGeneration(details.id)
    };
  }

  private transformDetailedData(details: PokemonApiResponse, speciesData: PokemonSpeciesApiResponse): PokemonDetailData {
    // Calculate gender ratio
    const genderRatio = speciesData.gender_rate === -1 
      ? { male: 0, female: 0 } // Genderless
      : {
          female: (speciesData.gender_rate / 8) * 100,
          male: ((8 - speciesData.gender_rate) / 8) * 100
        };

    // Find the English species name
    const speciesName = speciesData.genera.find(g => g.language.name === 'en')?.genus || '';

    return {
      ...this.transformBasicData(details),
      height: details.height / 10, // Convert to meters
      weight: details.weight / 10, // Convert to kilograms
      stats: {
        hp: details.stats[0].base_stat,
        attack: details.stats[1].base_stat,
        defense: details.stats[2].base_stat,
        specialAttack: details.stats[3].base_stat,
        specialDefense: details.stats[4].base_stat,
        speed: details.stats[5].base_stat
      },
      species: {
        url: details.species.url,
        name: speciesName
      },
      abilities: details.abilities.map(ability => ({
        name: ability.ability.name,
        isHidden: ability.is_hidden,
        slot: ability.slot
      })),
      baseExp: details.base_experience,
      catchRate: speciesData.capture_rate,
      baseFriendship: speciesData.base_happiness,
      growthRate: speciesData.growth_rate.name,
      genderRatio,
      eggGroups: speciesData.egg_groups.map(group => group.name)
    };
  }

  getAdjacentPokemon(id: number): Observable<{ prev: PokemonBasicData | null, next: PokemonBasicData | null }> {
    const prevId = id > 1 ? id - 1 : null;
    const nextId = id < 1010 ? id + 1 : null;

    const prevRequest = prevId 
      ? this.http.get<PokemonApiResponse>(`${this.baseUrl}/pokemon/${prevId}`).pipe(
          map(details => this.transformBasicData(details))
        )
      : of(null);

    const nextRequest = nextId
      ? this.http.get<PokemonApiResponse>(`${this.baseUrl}/pokemon/${nextId}`).pipe(
          map(details => this.transformBasicData(details))
        )
      : of(null);

    return forkJoin({
      prev: prevRequest,
      next: nextRequest
    });
  }

  private getGeneration(id: number): number {
    if (id <= 151) return 1;
    if (id <= 251) return 2;
    if (id <= 386) return 3;
    if (id <= 493) return 4;
    if (id <= 649) return 5;
    if (id <= 721) return 6;
    if (id <= 809) return 7;
    if (id <= 905) return 8;
    return 9;
  }

  getEvolutionChain(speciesUrl: string): Observable<any> {
    return this.http.get<any>(speciesUrl).pipe(
      switchMap(species => this.http.get<any>(species.evolution_chain.url)),
      map(chain => this.transformEvolutionChain(chain)),
      switchMap(evolutionChain => {
        // Fetch full details for each Pokemon in the chain
        const detailRequests = evolutionChain.map(pokemon => 
          this.getPokemonByName(pokemon.name).pipe(
            map(details => ({
              ...pokemon,
              id: details.id,
              types: details.types,
              imageUrl: details.imageUrl
            }))
          )
        );
        return forkJoin(detailRequests);
      })
    );
  }

  private transformEvolutionChain(chain: any): any[] {
    const evolutions: any[] = [];
    
    // Add base form
    evolutions.push({
      name: chain.chain.species.name,
      evolutionDetails: null,
      evolutionText: '',
      evolvesFrom: null
    });

    // Process first evolution stage
    chain.chain.evolves_to.forEach((evo1: EvolutionNode) => {
      evolutions.push({
        name: evo1.species.name,
        evolutionDetails: evo1.evolution_details[0],
        evolutionText: this.getEvolutionText(evo1.evolution_details[0]),
        evolvesFrom: chain.chain.species.name
      });

      // Process second evolution stage
      evo1.evolves_to.forEach((evo2: EvolutionNode) => {
        evolutions.push({
          name: evo2.species.name,
          evolutionDetails: evo2.evolution_details[0],
          evolutionText: this.getEvolutionText(evo2.evolution_details[0]),
          evolvesFrom: evo1.species.name
        });
      });
    });

    return evolutions;
  }

  private getEvolutionText(details: any): string {
    if (!details) return '';
    
    const conditions = [];
    
    // Trade condition
    if (details.trigger?.name === 'trade') {
      if (details.held_item) {
        conditions.push(`Trade while holding ${this.formatItemName(details.held_item.name)}`);
      } else {
        conditions.push('Trade');
      }
    }

    // Level up condition
    else if (details.trigger?.name === 'level-up') {
      if (details.min_level) {
        conditions.push(`Level ${details.min_level}`);
      }

      if (details.min_happiness) {
        conditions.push(`High Friendship (${details.min_happiness}+)`);
      }

      if (details.time_of_day) {
        conditions.push(`During ${details.time_of_day}`);
      }

      if (details.held_item) {
        conditions.push(`Holding ${this.formatItemName(details.held_item.name)}`);
      }

      if (details.location) {
        conditions.push(`At ${this.formatLocationName(details.location.name)}`);
      }

      if (details.known_move) {
        conditions.push(`Knowing ${this.formatMoveName(details.known_move.name)}`);
      }

      if (details.known_move_type) {
        conditions.push(`Knowing a ${details.known_move_type.name}-type move`);
      }
    }

    // Item use condition
    else if (details.trigger?.name === 'use-item') {
      conditions.push(`Use ${this.formatItemName(details.item.name)}`);
    }

    return conditions.join(' + ');
  }

  private formatItemName(name: string): string {
    return name.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private formatLocationName(name: string): string {
    return name.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private formatMoveName(name: string): string {
    return name.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
