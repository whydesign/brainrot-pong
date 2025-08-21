// objectclass.js
class ObjectClass {
    constructor() {
        if (this.new) {
            this.new(...arguments);
        }
    }

    static extend() {
        class SubClass extends this {}
        SubClass.super = this;
        return SubClass;
    }

    static implement(...classes) {
        for (let cls of classes) {
            for (let key of Object.getOwnPropertyNames(cls.prototype)) {
                if (key !== "constructor" && typeof cls.prototype[key] === "function") {
                    if (!this.prototype[key]) {
                        this.prototype[key] = cls.prototype[key];
                    }
                }
            }
        }
    }

    is(T) {
        return this instanceof T;
    }

    toString() {
        return "Object";
    }
}

export default ObjectClass;
