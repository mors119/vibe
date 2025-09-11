import { initTRPC } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});
// t-개체는 설명력이 떨어지기 때문에 전체 t-개체를 내보내지 마세요.
// 예를 들어, t 변수를 사용하는 것은 i18n 라이브러리에서 흔히 볼 수 있습니다.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// 기본 라우터 및 프로시저 도우미
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
