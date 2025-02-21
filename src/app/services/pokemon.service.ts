import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, tap, switchMap, take } from 'rxjs/operators';
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
  private allPokemon = new BehaviorSubject<PokemonBasicData[]>([]);
  private isLoading = new BehaviorSubject<boolean>(true);

  private readonly GENERATION_RANGES = [
    { number: 1, startId: 1, endId: 151 },
    { number: 2, startId: 152, endId: 251 },
    { number: 3, startId: 252, endId: 386 },
    { number: 4, startId: 387, endId: 493 },
    { number: 5, startId: 494, endId: 649 },
    { number: 6, startId: 650, endId: 721 },
    { number: 7, startId: 722, endId: 809 },
    { number: 8, startId: 810, endId: 905 },
    { number: 9, startId: 906, endId: 1010 }
  ];

  constructor(private http: HttpClient) {
    this.loadAllPokemonData();
  }

  getAllPokemon(): Observable<PokemonBasicData[]> {
    return this.allPokemon.asObservable();
  }

  getLoadingStatus(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  private loadAllPokemonData() {
    this.isLoading.next(true);

    this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=1500`).pipe(
      map(response => response.results),
      map(pokemon => pokemon.map(p => {
        const id = this.getIdFromUrl(p.url);
        return this.http.get<PokemonApiResponse>(p.url).pipe(
          map(details => ({
            id: details.id,
            name: details.name,
            types: details.types.map(t => t.type.name),
            imageUrl: details.sprites.other['official-artwork'].front_default,
            generation: this.getGeneration(details.id)
          }))
        );
      })),
      switchMap(observables => forkJoin(observables)),
      tap(pokemon => {
        pokemon.sort((a, b) => a.id - b.id);
        this.allPokemon.next(pokemon);
        this.isLoading.next(false);
      }),
      catchError(this.handleError)
    ).subscribe();
  }

  private getIdFromUrl(url: string): number {
    const matches = url.match(/\/(\d+)\/?$/);
    return matches ? parseInt(matches[1]) : 1;
  }

  private getGeneration(id: number): number {
    const gen = this.GENERATION_RANGES.find(g => id >= g.startId && id <= g.endId);
    return gen ? gen.number : 1;
  }

  private handleError(error: HttpErrorResponse) {
    this.isLoading.next(false);
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
