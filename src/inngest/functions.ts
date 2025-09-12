import { openai, createAgent } from '@inngest/agent-kit';

import { inngest } from './client';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event }) => {
    const codeAgent = createAgent({
      name: 'code-agent',
      system:
        'You are an expert next.js developer. You write readable, maintainable code. You write simple Next.js & React snippets.',
      model: openai({ model: 'gpt-4o' }), // api key 이름을 임의 조정했을 경우 model 옆에 추가
    });

    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.value}`,
    );

    return { output };
  },
);
