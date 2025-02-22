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
  private allPokemon = new BehaviorSubject<PokemonBasicData[]>([]);
  private isFullDataLoaded = new BehaviorSubject<boolean>(false);
  private isLoading = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  // Get initial batch quickly
  getInitialBatch(limit: number = 100): Observable<PokemonBasicData[]> {
    this.isLoading.next(true);
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}`).pipe(
      switchMap(response => {
        const detailsRequests = response.results.map(pokemon => 
          this.http.get<PokemonApiResponse>(pokemon.url).pipe(
            map(details => this.transformPokemonData(details))
          )
        );
        return forkJoin(detailsRequests);
      }),
      tap(pokemon => {
        this.allPokemon.next(pokemon);
        this.isLoading.next(false);
      }),
      catchError(error => {
        console.error('Error loading initial batch:', error);
        this.isLoading.next(false);
        return of([]);
      })
    );
  }

  // Load full dataset in background
  loadFullDataset(): void {
    if (this.isFullDataLoaded.value) return;

    this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=1500`).pipe(
      switchMap(response => {
        const detailsRequests = response.results.map(pokemon =>
          this.http.get<PokemonApiResponse>(pokemon.url).pipe(
            map(details => this.transformPokemonData(details))
          )
        );
        return forkJoin(detailsRequests);
      })
    ).subscribe({
      next: (pokemon) => {
        this.allPokemon.next(pokemon);
        this.isFullDataLoaded.next(true);
      },
      error: (error) => console.error('Error loading full dataset:', error)
    });
  }

  getAllPokemon(): Observable<PokemonBasicData[]> {
    return this.allPokemon.asObservable();
  }

  getLoadingStatus(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  isFullDatasetLoaded(): Observable<boolean> {
    return this.isFullDataLoaded.asObservable();
  }

  getPokemonById(id: number): Observable<PokemonBasicData> {
    // First try to find it in our cached data
    const cached = this.allPokemon.getValue().find(p => p.id === id);
    if (cached) {
      return of(cached);
    }

    // If not in cache, fetch from API
    return this.http.get<PokemonApiResponse>(`${this.baseUrl}/pokemon/${id}`).pipe(
      map(response => this.transformPokemonData(response)),
      catchError(error => {
        console.error('Error fetching Pokemon details:', error);
        return throwError(() => new Error('Failed to load Pokemon details'));
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
    const GENERATION_RANGES = [
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

    const gen = GENERATION_RANGES.find(g => id >= g.startId && id <= g.endId);
    return gen ? gen.number : 1;
  }
}
