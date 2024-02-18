export interface Player {
  id: number;
  name: string;
  role: string;
  position?: { x: number; y: number };
}
