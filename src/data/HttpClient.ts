import { IHttpClient } from '../interfaces/IHttpClient';

export default class HttpClient implements IHttpClient {
  private readonly url: string;
  private readonly baseUrl: string = 'http://localhost:3001';
  constructor(resource: string) {
    this.url = `${this.baseUrl}/${resource}`;
  }

  async get<T>(query: string = ''): Promise<T> {
    const res = await fetch(`${this.url}${query}`);
    return await res.json();
  }

  async post<T>(data: T): Promise<T> {
    const res = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  }
}
