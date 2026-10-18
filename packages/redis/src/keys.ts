export type AppEnv = "development" | "staging" | "production";

export function makeKeyBuilder(env: AppEnv) {
  return (area: string, ...parts: string[]): string => {
    if (!/^[a-z][a-z0-9-]*$/.test(area)) throw new Error(`Bad key area: ${area}`);
    for (const p of parts) {
      if (!p || /\s/.test(p)) throw new Error("Key parts must be non-empty, no spaces");
    }
    return ["td", env, area, ...parts].join(":");
  };
}
