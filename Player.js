export class Player {
    constructor(name, health, mana, damage, img) {
        this.name = name;
        this.health = health;
        this.mana = mana;
        this.damage = damage;
        this.img = img;
    }

    show() {
        return this.name + "\n " + this.img + "\n " + this.health + "\n " + this.mana;
    }
}
    