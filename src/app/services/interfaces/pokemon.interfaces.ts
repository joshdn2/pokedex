export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListResult[];
}

export interface PokemonListResult {
  name: string;
  url: string;
}

export interface PokemonBasicData {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  generation: number;
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

export interface PokemonGeneration {
  number: number;
  name: string;
  pokemon: PokemonBasicData[];
}
