/**
 * Fisher-Yates shuffle algorithm for randomizing array elements
 * This ensures a truly random distribution
 */
export function shuffleArray<T>(array: T[]): T[] {
  // Create a copy to avoid mutating the original array
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate random index from 0 to i
    const randomIndex = Math.floor(Math.random() * (i + 1));
    
    // Swap elements at i and randomIndex
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  
  return shuffled;
}
