class Player {
    constructor(name, health, mana, damage, img) {
        this.name = name;
        this.health = health;
        this.mana = mana;
        this.damage = damage;
        this.img = img;
    }

    show() {
        console.log(this.name + " " + this.img + " " + this.health + " " + this.mana);
    }
}

let player = new Player("Hip", 100, 100, 10, "");
