import { GenericQueryCtx } from "convex/server";
import { DataModel } from "../_generated/dataModel";

export async function getUserEmail(ctx: GenericQueryCtx<DataModel>) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return identity.email;
}