/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as achievements from "../achievements.js";
import type * as dilemmas from "../dilemmas.js";
import type * as lib_evolvePetIfNeeded from "../lib/evolvePetIfNeeded.js";
import type * as lib_getAverageMoralStats from "../lib/getAverageMoralStats.js";
import type * as lib_getPartitionedDilemmas from "../lib/getPartitionedDilemmas.js";
import type * as lib_processDilemmaResponse from "../lib/processDilemmaResponse.js";
import type * as lib_prompt from "../lib/prompt.js";
import type * as pets from "../pets.js";
import type * as state from "../state.js";
import type * as user from "../user.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  achievements: typeof achievements;
  dilemmas: typeof dilemmas;
  "lib/evolvePetIfNeeded": typeof lib_evolvePetIfNeeded;
  "lib/getAverageMoralStats": typeof lib_getAverageMoralStats;
  "lib/getPartitionedDilemmas": typeof lib_getPartitionedDilemmas;
  "lib/processDilemmaResponse": typeof lib_processDilemmaResponse;
  "lib/prompt": typeof lib_prompt;
  pets: typeof pets;
  state: typeof state;
  user: typeof user;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
