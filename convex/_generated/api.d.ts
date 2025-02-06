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
import type * as dilemmas from "../dilemmas.js";
import type * as lib_getUnseenDilemma from "../lib/getUnseenDilemma.js";
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
  dilemmas: typeof dilemmas;
  "lib/getUnseenDilemma": typeof lib_getUnseenDilemma;
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
