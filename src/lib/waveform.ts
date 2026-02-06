/**
 * Generates a seeded random array of amplitude values for waveform visualization
 * Using a simple linear congruential generator for consistent results per seed
 * @param seed A seed value to generate consistent waveforms for the same release
 * @param count Number of bars in the waveform (default 40)
 * @param min Minimum amplitude value (default 10)
 * @param max Maximum amplitude value (default 100)
 * @returns Array of amplitude values
 */
export function generateWaveformData(
  seed: string,
  count: number = 40,
  min: number = 10,
  max: number = 100
): number[] {
  // Create a numeric seed from the string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }

  // Normalize the hash to a positive value
  hash = Math.abs(hash);

  const result: number[] = [];
  
  for (let i = 0; i < count; i++) {
    // Linear congruential generator formula
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    
    // Generate a random value between min and max
    const randomValue = min + (hash % (max - min + 1));
    result.push(randomValue);
  }
  
  return result;
}

/**
 * Creates a deterministic seed from a release ID
 * @param releaseId The unique identifier for a release
 * @returns A numeric seed value
 */
function createSeedFromId(releaseId: string): number {
  let hash = 0;
  for (let i = 0; i < releaseId.length; i++) {
    const char = releaseId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Gets waveform data for a specific release
 * @param releaseId The unique identifier for a release
 * @param count Number of bars in the waveform (default 40)
 * @returns Array of amplitude values
 */
export function getWaveformDataForRelease(
  releaseId: string,
  count: number = 40
): number[] {
  const seed = createSeedFromId(releaseId);
  return generateWaveformData(seed.toString(), count);
}