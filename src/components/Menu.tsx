/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stack } from '@mui/material';

import { Pizzas, PizzaType } from '../../shared/common.ts';
import { useState, useEffect } from 'react';
import MenuItemCard from './MenuItemCard.tsx';

import { Order, EditOrder } from '../../shared/common.ts';

interface MainMenuProps {
    addToCart: (order: Order) => void;
    updateOrder: (updated: Order) => void;
    passedOrder: EditOrder | null;
}

function MainMenu({ addToCart, passedOrder, updateOrder }: MainMenuProps) {
    const [pizzas, setPizzas] = useState<PizzaType[]>([]);
    const [editOrder, setEditOrder] = useState<EditOrder | null>(null);
    console.log('passedOrder', passedOrder);

    useEffect(() => {
        let nextPizzas = Pizzas;

        if (passedOrder && passedOrder.order) {
            const order = passedOrder.order;
            nextPizzas = Pizzas.map(pizza => {
                if (pizza.name === order.item.name) {
                    pizza = order.item;
                    pizza.id = order.id;
                }
                return pizza;
            });
            // console.log('found', found, nextPizzas);
        }
        setPizzas(nextPizzas);
        setEditOrder(passedOrder);
    }, [passedOrder]);

    return (
        <Stack spacing={{ xs: 5, sm: 3 }} direction="row" useFlexGap flexWrap="wrap">
            {pizzas.map((item, index) => {
                const editerMode = editOrder && item.id === editOrder.order.id;

                return editerMode ? (
                    <MenuItemCard
                        item={item}
                        key={index}
                        addToCart={addToCart}
                        open={editOrder.editMode}
                        updateOrder={updateOrder}
                        passedOrder={editOrder.order}
                    ></MenuItemCard>
                ) : (
                    <MenuItemCard
                        item={item}
                        key={index}
                        addToCart={addToCart}
                        updateOrder={updateOrder}
                    ></MenuItemCard>
                );
            })}
        </Stack>
    );
}

export default MainMenu;
