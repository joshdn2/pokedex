import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { 
  PokemonBasicData, 
  PokemonDetailData, 
  PokemonListResponse, 
  PokemonApiResponse 
} from './interfaces/pokemon.interfaces';

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
    // Directly fetch the individual Pokemon's detailed data
    return this.http.get<PokemonApiResponse>(`${this.baseUrl}/pokemon/${id}`).pipe(
      map(details => this.transformDetailedData(details)),
      catchError(error => {
        console.error('Error fetching Pokemon details:', error);
        return throwError(() => error);
      })
    );
  }

  getPokemonByName(name: string): Observable<PokemonDetailData> {
    return this.http.get<PokemonApiResponse>(`${this.baseUrl}/pokemon/${name.toLowerCase()}`).pipe(
      map(details => this.transformDetailedData(details)),
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

  private transformDetailedData(details: PokemonApiResponse): PokemonDetailData {
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
      }
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
}
