export default class Ticket {
    constructor(id, name, description = "", status = false) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.created = Date.now();
    }

    toJSON() {
        const { description, ...data } = this;
        return data;
    }

    toFullJSON() {
        return { ...this };
    }
}
