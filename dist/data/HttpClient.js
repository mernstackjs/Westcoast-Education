export default class HttpClient {
    url;
    baseUrl = 'http://localhost:3001';
    constructor(resource) {
        this.url = `${this.baseUrl}/${resource}`;
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
}
//# sourceMappingURL=HttpClient.js.map