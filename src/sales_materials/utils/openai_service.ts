import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private client: OpenAI;
  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async getEmbedding(text: string): Promise<number[]> {
    const resp = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    const embedding = resp?.data?.[0]?.embedding;
    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error('OpenAI returned no embedding');
    }
    return embedding;
  }
}