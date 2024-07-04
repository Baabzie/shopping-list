interface historyI {
  store: string;
  data: { price: number; date: string };
}

export interface itemI {
  text: string;
  done: boolean;
  date?: string;
  history?: historyI[];
}
