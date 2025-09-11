'use client';
// ^-- 서버 구성 요소에서 제공자를 마운트할 수 있는지 확인하기 위해
import superjson from 'superjson';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
let browserQueryClient: QueryClient;
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  /**
   * 브라우저: 아직 쿼리 클라이언트가 없는 경우 새 쿼리 클라이언트를 만듭니다.
   * 이는 매우 중요하므로 초기 렌더링 중에 React가 일시 중단되더라도 새 클라이언트를 다시 만들지 않습니다.
   * 쿼리 클라이언트 생성 아래에 서스펜스 경계가 있는 경우에는 이 작업이 필요하지 않을 수 있습니다
   */
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    return process.env.NEXT_PUBLIC_APP_URL;
  })();
  return `${base}/api/trpc`;
}
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  /* 
  NOTE: 쿼리 클라이언트를 초기화할 때 이와 코드 사이에 서스펜스 경계가 없다면 useState를 사용하지 마세요. 
  리액트는 클라이언트가 일시 중단되고 경계가 없으면 초기 렌더링에서 클라이언트를 버리기 때문입니다 
  */
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: getUrl(),
        }),
      ],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
