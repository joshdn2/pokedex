import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin, throwError } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import {
  PokemonListResponse,
  PokemonBasicData,
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
        this.cachedPokemon = pokemonDetails.map(details => this.transformPokemonData(details));
        return this.cachedPokemon;
      }),
      catchError(error => {
        console.error('Error fetching Pokemon:', error);
        return throwError(() => error);
      })
    );
  }

  private transformPokemonData(details: PokemonApiResponse): PokemonBasicData {
    return {
      id: details.id,
      name: details.name,
      types: details.types.map(t => t.type.name),
      imageUrl: details.sprites.other['official-artwork'].front_default,
      generation: this.getGeneration(details.id)
    };
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

  getPokemonById(id: number): Observable<PokemonBasicData> {
    if (this.cachedPokemon.length > 0) {
      const pokemon = this.cachedPokemon.find(p => p.id === id);
      if (pokemon) return of(pokemon);
    }

    return this.http.get<PokemonApiResponse>(`${this.baseUrl}/pokemon/${id}`).pipe(
      map(details => this.transformPokemonData(details))
    );
  }
}
