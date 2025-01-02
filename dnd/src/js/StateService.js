export default class StateService {
    constructor(storage) {
        this.storage = storage;
    }

    save(state) {
        this.storage.setItem('state', JSON.stringify(state));
    }

    load() {
        try {
            const data = this.storage.getItem('state');
            return data ? JSON.parse(data) : {
                todo: [],
                'in-progress': [],
                done: []
            };
        } catch (e) {
            throw new Error('Ошибка при загрузке данных');
        }
    }
};