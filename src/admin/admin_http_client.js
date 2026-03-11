export default class AdminHttpClient {
  constructor(resource) {
    this.url = `${'http://localhost:3001'}/${resource}`;
  }

  async get(query = '') {
    const res = await fetch(`${this.url}${query}`);
    return await res.json();
  }

  async post(data) {
    const res = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  }

  async patch(id, data) {
    const res = await fetch(`${this.url}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  }
}
