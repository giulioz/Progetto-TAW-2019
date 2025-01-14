export class ElementMenu{
    name_element_menu: string;
    category: string;
    type: string;
    time: number;
    price: number;
    quantity?: number;
    constructor(elementMenu: ElementMenu) {
        this.name_element_menu = elementMenu.name_element_menu;
        this.category = elementMenu.category;
        this.type = elementMenu.type;
        this.time = elementMenu.time
        this.price = elementMenu.price;
        if (elementMenu.quantity)
            this.quantity = elementMenu.quantity;
    }
}