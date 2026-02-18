import { NormalizedArgument, NormalizedObject } from "@/@types";

/**
 * Calculate collective attitude according to the formula from Vivas et al. (2022):
 * Collective attitude (s) = (1/n) × Σ [n_c × ((n_s,c⁺ + 1)/(n_s,c + 2))] / C
 * 
 * Where:
 * - n_s,c⁺ = number of favorable arguments for criterion c and scenario s
 * - n_s,c = total number of arguments (favorable + unfavorable) for criterion c and scenario s
 * - n_c = total number of arguments for criterion c (all scenarios)
 * - n = total number of arguments (all criteria and scenarios)
 * - C = number of criteria
 * - +1 and +2 are "hidden arguments" for initialization
 * 
 * Returns a number between 0 (total rejection) and 1 (total approval)
 */
export const calculateCollectiveAttitude = (
  allArguments: NormalizedArgument[],
  filteredArguments: NormalizedArgument[],
  criterionsMap: NormalizedObject | null | undefined
): number => {
  // If no arguments at all, return 0.5 (neutral)
  if (!allArguments || allArguments.length === 0) {
    return 0.5;
  }

  if (!filteredArguments || filteredArguments.length === 0) {
    return 0.5;
  }

  if (!criterionsMap) {
    return 0.5;
  }

  // n = total number of arguments (all criteria and scenarios)
  const n = allArguments.length;

  // C = number of criteria actually used in the filtered arguments
  const criteriaUsed = new Set(filteredArguments.map(arg => arg.criterion));
  const C = criteriaUsed.size;

  if (C === 0) {
    return 0.5;
  }

  // Calculate attitude for each criterion and sum them
  let attitudeSum = 0;

  for (const criterionId of criteriaUsed) {
    // n_c = total number of arguments for this criterion (all scenarios)
    const n_c = allArguments.filter(arg => arg.criterion === criterionId).length;

    // n_s,c⁺ = number of favorable arguments for this criterion in filtered set
    const n_s_c_plus = filteredArguments.filter(
      arg => arg.criterion === criterionId && arg.favorable
    ).length;

    // n_s,c = total number of arguments for this criterion in filtered set
    const n_s_c = filteredArguments.filter(
      arg => arg.criterion === criterionId
    ).length;

    // Calculate attitude for this criterion: n_c × ((n_s,c⁺ + 1)/(n_s,c + 2))
    const criterionAttitude = n_c * ((n_s_c_plus + 1) / (n_s_c + 2));
    attitudeSum += criterionAttitude;
  }

  // Final formula: (1/n) × Σ [n_c × ((n_s,c⁺ + 1)/(n_s,c + 2))] / C
  const collectiveAttitude = (1 / n) * attitudeSum / C;

  return collectiveAttitude;
};

/**
 * Simpler version for when you only need attitude for a specific subset
 * (e.g., one criterion + one alternative combination)
 */
export const calculateSimpleAttitude = (
  allArguments: NormalizedArgument[],
  filteredArguments: NormalizedArgument[]
): number => {
  // If no arguments, return 0.5
  if (!filteredArguments || filteredArguments.length === 0) {
    return 0.5;
  }

  // Simple proportion: (favorable + 1) / (total + 2)
  const favorable = filteredArguments.filter(arg => arg.favorable).length;
  const total = filteredArguments.length;

  return (favorable + 1) / (total + 2);
};
