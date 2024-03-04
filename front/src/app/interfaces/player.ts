export interface Player {
  id: number;
  name: string;
  email?: string;
  role: string;
  position?: { x: number; y: number };
}
