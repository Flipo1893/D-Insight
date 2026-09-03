import type { Collection, Document } from "mongodb";

/**
 * Runs a collection's index setup once, without letting it become a
 * permanent failure.
 *
 * Two things this guards against, both seen in practice:
 *
 * - Index setup is preparation, not the job. If MongoDB refuses an index
 *   (an older index on the same key under a different name, a permissions
 *   problem), reading the collection still works — so a refusal must not
 *   take the whole page down with it.
 * - A rejected promise kept in the cache replays that failure on every
 *   later request, so the page stays broken until the server restarts.
 *   Clearing the cache lets the next call try again.
 */
export function createIndexGuard<T extends Document>(
  setup: (collection: Collection<T>) => Promise<unknown>,
) {
  let ready: Promise<unknown> | undefined;

  return (collection: Collection<T>) => {
    ready ??= setup(collection).catch((error) => {
      ready = undefined;
      console.error("[mongodb] Index-Setup fehlgeschlagen:", error);
    });

    return ready;
  };
}
