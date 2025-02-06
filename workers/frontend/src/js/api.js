export default class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getData() {
        try {
            const response = await fetch(`${this.baseUrl}/news`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch data');
        }
    }
};