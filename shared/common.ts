export type PizzaType = {
    name: string;
    description: string;
    ingredients: string[];
    allergens: string[];
    image: string;
    id?: string;
    KCal: number;
};

export const PORT = process.env.PORT || 8000;
export const apiUrl = `http://localhost:${PORT}/api`;

const Pizzas: PizzaType[] = [
    {
        name: 'Margherita',
        description: 'The classic. Simple, yet delicious.',
        ingredients: ['Tomato sauce', 'Mozzarella cheese'],
        allergens: ['Milk', 'Wheat'],
        image: 'https://www.example.com/margherita.jpg',
        KCal: 2171,
    },
    {
        name: 'Pepperoni Passion',
        description: 'A spicy twist on the classic pepperoni pizza.',
        ingredients: ['Mozzarella cheese', 'Pepperoni', 'Jalapenos', 'Tomato sauce'],
        allergens: ['Milk', 'Wheat'],
        image: 'https://www.example.com/pepperoni_passion.jpg',
        KCal: 2642,
    },
    {
        name: 'Hawaiian',
        description: 'A tropical treat with ham and pineapple.',
        ingredients: ['Mozzarella cheese', 'Ham', 'Pineapple', 'Tomato sauce'],
        allergens: ['Milk', 'Wheat'],
        image: 'https://www.example.com/hawaiian.jpg',
        KCal: 2082,
    },
    {
        name: 'Meat Feast',
        description: "A carnivore's delight with pepperoni, ham, sausage, and ground beef.",
        ingredients: [
            'Ground beef',
            'Ham',
            'Mozzarella cheese',
            'Pepperoni',

            'Sausage',

            'Tomato sauce',
        ],
        allergens: ['Milk', 'Wheat'],
        image: 'https://www.example.com/meat_feast.jpg',
        KCal: 2742,
    },
    {
        name: 'Veggie',
        description: 'A vegetarian option with mushrooms, onions, green peppers, and black olives.',
        ingredients: [
            'Black olives',
            'Green peppers',
            'Tomato sauce',
            'Mozzarella cheese',
            'Mushrooms',
            'Onions',
        ],
        allergens: ['Milk', 'Wheat'],
        image: 'https://www.example.com/veggie.jpg',
        KCal: 2313,
    },
    {
        name: 'Texas BBQ',
        description:
            'A sweet and tangy pizza with BBQ sauce, chicken,  Smoked Bacon Rashers and onions.',
        ingredients: [
            'Smoked Bacon Rashers',
            'Mozzarella cheese',

            'Chicken',
            'BBQ Sauce',
            'Onions',
        ],
        allergens: ['Milk', 'Wheat'],
        image: 'https://www.example.com/bbq_chicken.jpg',
        KCal: 2309,
    },

    {
        name: 'Tuna Supreme',
        description: 'A fishy treat with tuna, onions, green peppers, and black olives.',
        ingredients: [
            'Mozzarella cheese',
            'Tuna',
            'Onions',
            'Green peppers',
            'Black olives',
            'Tomato sauce',
        ],

        allergens: ['Milk', 'Wheat'],
        image: 'https://www.example.com/extravaganzza.jpg',
        KCal: 2129,
    },
    // Add more pizzas here
];

const extraToppings: string[] = [
    'Anchovies',
    'Bacon',
    'Beef',
    'Black Olives',
    'Chicken',
    'Chorizo',
    'Feta Cheese',
    'Green Chillies',
    'Green Peppers',
    'Ham',
    'Jalapenos',
    'Mushrooms',
    'Onions',
    'Pepperoni',
    'Pineapple',
    'Red Onions',
    'Red Peppers',
    'Roquito Peppers',
    'Sausage',
    'Spinach',
    'Sweetcorn',
    'Tomatoes',
];

export interface Topping {
    selected: boolean;
    price: number;
    name: string;
}
const CostPerExtraTopping = 1.49;

const CostPerSize = {
    Small: { inches: 9.5, price: 6.99 },
    Medium: { inches: 11.5, price: 8.99 },
    Large: { inches: 13.5, price: 11.99 },
} as const;

export interface Order {
    item: PizzaType;
    quantity: number;
    size: keyof typeof CostPerSize;
    total: number;
    extra: Topping[];
    specialInstructions?: string;
    id?: string;
    edited?: boolean;
}
for (const i in Pizzas) {
    const pizza = Pizzas[i];
    const name = pizza.name.replace(/\s+/g, '');
    const image = await import(`../src/assets/${name}.webp`);
    pizza.image = image.default;
    pizza.id = i;
}

export type OrderRecord = Record<string, Record<string, Order>>;
export interface Storage {
    getOrders(): Map<string, Order> | Record<string, Order | OrderRecord>;
    addOrder(key: string, order: Order | OrderRecord): void;
    removeOrder(key: string): void;
    clearOrders(): void;
    updateOrder(key: string, order: Order | OrderRecord): void;
}
export interface EditOrder {
    order: Order;
    editMode: boolean;
    count: number;
}
export { Pizzas, extraToppings, CostPerExtraTopping, CostPerSize };
