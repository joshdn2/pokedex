import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
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
  private cache = new Map<number, PokemonBasicData>();

  constructor(private http: HttpClient) {}

  getPokemonPage(offset: number = 0, limit: number = 20): Observable<PokemonBasicData[]> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`)
      .pipe(
        catchError(this.handleError),
        map(response => response.results),
        map(pokemon => pokemon.map(p => {
          const id = parseInt(p.url.split('/').filter(Boolean).pop() || '0');
          return this.cache.has(id) 
            ? of(this.cache.get(id)!) 
            : this.getPokemonDetails(id);
        })),
        mergeMap(promises => forkJoin(promises))
      );
  }

  private getPokemonDetails(id: number): Observable<PokemonBasicData> {
    return this.http.get<PokemonApiResponse>(`${this.baseUrl}/pokemon/${id}`).pipe(
      catchError(this.handleError),
      map(response => {
        const pokemonData: PokemonBasicData = {
          id: response.id,
          name: response.name,
          types: response.types.map(t => t.type.name),
          imageUrl: response.sprites.other['official-artwork'].front_default,
          generation: this.getGeneration(id)
        };
        
        this.cache.set(id, pokemonData);
        return pokemonData;
      })
    );
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

  searchPokemon(query: string): Observable<PokemonBasicData[]> {
    return of(Array.from(this.cache.values())
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase())));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
