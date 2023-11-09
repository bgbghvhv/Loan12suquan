export class Player {
    constructor(name, health, mana, food, damage, img) {
        this.name = name;
        this.health = health;
        this.mana = mana;
        this.damage = damage;
        this.img = img;
        this.food = food;
    }

    show() {
        return this.name + "\n " + this.img + "\n " + this.health + "\n " + this.mana;
    }

}
    