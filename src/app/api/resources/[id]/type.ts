export type Params = {
  id: string;
};

export type NextParams<T = Params> = {
  params: T;
};
