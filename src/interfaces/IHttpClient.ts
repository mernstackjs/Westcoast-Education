export interface IHttpClient {
  get<T>(query?: string): Promise<T>;
  post<T>(data: any): Promise<T>;
}
