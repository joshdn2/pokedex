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
    name: string;  // e.g., "Iron Armor Pokémon"
  };
  abilities: {
    name: string;
    isHidden: boolean;
    slot: number;
  }[];
  baseExp: number;
  catchRate: number;
  baseFriendship: number;
  growthRate: string;
  genderRatio: {
    male: number;
    female: number;
  };
  eggGroups: string[];
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
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  base_experience: number;
}

export interface PokemonGeneration {
  number: number;
  name: string;
  pokemon: PokemonBasicData[];
}

export interface PokemonSpeciesApiResponse {
  base_happiness: number;
  capture_rate: number;
  egg_groups: {
    name: string;
    url: string;
  }[];
  gender_rate: number; // -1 for genderless, or 0-8 (representing female ratio in eighths)
  growth_rate: {
    name: string;
    url: string;
  };
  genera: {
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
}
