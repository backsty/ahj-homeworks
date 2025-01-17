export default class StateManager {
    constructor() {
        this.storageKey =  'helpdesk_state';
    }

    saveState(tickets) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(tickets));
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }

    loadState() {
        try {
            const state = localStorage.getItem(this.storageKey);
            return state ? JSON.parse(state) : [];
        } catch (error) {
            console.error('Error loading state:', error);
        }
    }

    clearState() {
        localStorage.removeItem(this.storageKey);
    }
};