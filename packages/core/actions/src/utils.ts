import { MultipleRelationRepository, Repository } from '@nocobase/database';
import { Context } from '.';

export function pageArgsToLimitArgs(
  page: number,
  pageSize: number,
): {
  offset: number;
  limit: number;
} {
  return {
    offset: (page - 1) * pageSize,
    limit: pageSize,
  };
}

export function getRepositoryFromParams(ctx: Context) {
  const { resourceName, resourceOf } = ctx.action;

  if (resourceOf) {
    return ctx.db.getRepository<MultipleRelationRepository>(resourceName, resourceOf);
  }

  return ctx.db.getRepository<Repository>(resourceName);
}

export function RelationRepositoryActionBuilder(method: 'remove' | 'set') {
  return async function (ctx: Context, next) {
    const repository = getRepositoryFromParams(ctx);

    await repository[method](ctx.action.params.values);

    ctx.status = 200;
    await next();
  };
}
