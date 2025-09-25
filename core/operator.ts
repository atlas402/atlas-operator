import Anthropic from '@anthropic-ai/sdk';

export interface OperatorConfig {
  anthropicApiKey: string;
  facilitatorUrl: string;
}

export class AtlasOperator {
  private client: Anthropic;
  private config: OperatorConfig;
  private conversationHistory: Array<{ role: string; content: string }> = [];

  constructor(config: OperatorConfig) {
    this.config = config;
    this.client = new Anthropic({ apiKey: config.anthropicApiKey });
  }

  async chat(options: { message: string; context?: Record<string, any> }): Promise<any> {
    const messages = [
      ...this.conversationHistory,
      { role: 'user', content: options.message },
    ];

    const systemPrompt = this.buildSystemPrompt(options.context || {});

    const response = await this.client.messages.create({
      model: 'claude-3-5-opus-20241022',
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages,
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    
    this.conversationHistory.push({ role: 'user', content: options.message });
    this.conversationHistory.push({ role: 'assistant', content });

    return { message: content };
  }

  async discoverServices(filters: Record<string, any> = {}): Promise<any[]> {
    const url = new URL(`${this.config.facilitatorUrl}/discovery/resources`);
    Object.entries(filters).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });

    const response = await fetch(url.toString());
    const data = await response.json();
    return data.resources || [];
  }

  private buildSystemPrompt(context: Record<string, any>): string {
    return `You are Atlas Operator, the AI control plane for Atlas402.
Network: ${context.network || 'base'}
Budget: ${context.budget || 'unlimited'}`;
  }
}

export default AtlasOperator;


