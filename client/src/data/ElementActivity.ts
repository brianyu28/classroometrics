import { Element } from "./Room";

export interface ElementActivity {
  element: Element;
  x: number;
  y: number;
  timestamp: number;
}
