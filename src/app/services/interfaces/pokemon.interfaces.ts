// Basic data for list view
export interface PokemonBasicData {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  generation: number;
}

// Detailed data for individual Pokemon page
export interface PokemonDetailData extends PokemonBasicData {
  height: number;
  weight: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

// API responses
export interface PokemonListResponse {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
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
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

export interface PokemonGeneration {
  number: number;
  name: string;
  pokemon: PokemonBasicData[];
}
