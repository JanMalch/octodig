export interface Rate {
  remaining: number;
  limit: number;
  reset: number;
}

export interface RateResponse {
  resources: {
    core: Rate;
    search: Rate;
    graphql: Rate;
    integration_manifest: Rate;
  };
  rate: Rate;
}

export interface RateState extends Rate {
  icon: string;
}
