import { Some, None, isSome } from "./index";
import type { RSome, TaskMap } from "./type";

export class P<X, T extends RSome<X>> extends Promise<T> {
  map: TaskMap<X> = (f) =>
    super
      .then((o: any) => ((o = o.map(f)), isSome(o) ? o.join() : o))
      .then(Some, None) as any;
}
