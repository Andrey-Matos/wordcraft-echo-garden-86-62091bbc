
export type NeologismStatus = "Draft" | "Ready" | "Rejected";

export type Category = {
  id: string;
  name: string;
};

export type Neologism = {
  id: string;
  name: string;
  rootWords: string[]; // Now allows up to 4 elements instead of 3
  categoryId: string;
  category?: string;
  definition: string;
  imageUrl?: string;
  status: NeologismStatus;
  createdAt: Date;
};
