declare module "@elizaos/core" {
  export interface Memory {
    id?: string;
    userId?: string;
    agentId?: string;
    roomId?: string;
    content: {
      text?: string;
      action?: string;
      [key: string]: unknown;
    };
    createdAt?: number;
  }

  export interface State {
    [key: string]: unknown;
  }

  export interface ActionExample {
    user: string;
    content: {
      text: string;
      action?: string;
      [key: string]: unknown;
    };
  }

  export type HandlerCallback = (response: {
    text: string;
    content?: Record<string, unknown>;
  }) => Promise<void> | void;

  export interface IAgentRuntime {
    agentId: string;
    getSetting(key: string): string | undefined;
    composeState?(message: Memory): Promise<State>;
  }

  export interface Action {
    name: string;
    similes: string[];
    description: string;
    validate: (runtime: IAgentRuntime, message: Memory, state?: State) => Promise<boolean>;
    handler: (
      runtime: IAgentRuntime,
      message: Memory,
      state?: State,
      options?: Record<string, unknown>,
      callback?: HandlerCallback
    ) => Promise<boolean>;
    examples: ActionExample[][];
  }

  export interface Provider {
    get: (runtime: IAgentRuntime, message: Memory, state?: State) => Promise<string>;
  }

  export interface Plugin {
    name: string;
    description: string;
    actions: Action[];
    providers?: Provider[];
    evaluators?: unknown[];
    services?: unknown[];
  }
}
