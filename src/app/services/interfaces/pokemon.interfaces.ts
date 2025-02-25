// Basic data for list view
export interface PokemonBasicData {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  pixelSprite: string;
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
  species: {
    url: string;
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
    front_default: string;
    front_shiny: string;
    back_default: string;
    back_shiny: string;
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
  species: {
    url: string;
  };
}

export interface PokemonGeneration {
  number: number;
  name: string;
  pokemon: PokemonBasicData[];
}
