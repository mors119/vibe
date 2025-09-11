import 'server-only'; // <-- 이 파일을 클라이언트에서 가져올 수 없도록 합니다
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';
/**
 * 중요: 동일한 요청 중에 동일한 클라이언트를 반환할 쿼리 클라이언트를 위한 안정적인 게터를 만듭니다.
 */
export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});
export const caller = appRouter.createCaller(createTRPCContext);
