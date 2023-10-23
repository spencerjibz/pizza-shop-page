import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Item } from '../../../shared/util';

import { Order, PizzaType } from '../../../shared/common';
import OrderModel from '../OrderEditModal/OrderModel';

interface MenuItemCardProps {
    item: PizzaType;
    addToCart: (order: Order) => void;
    updateOrder: (updated: Order) => void;
    open?: boolean;
    passedOrder?: Order | null;
}

export default function MenuItemCard({
    item,
    addToCart,
    passedOrder,
    updateOrder,
    open = false,
}: MenuItemCardProps) {
    return (
        <Item key={item.id}>
            <Card elevation={15} key={item.id}>
                <CardMedia>
                    <img src={item.image} alt={item.name} />
                </CardMedia>

                <CardContent>
                    <Typography gutterBottom fontStyle="bold " variant="h6" component="div">
                        {item.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {item.KCal} kcal | Serves 3-4
                    </Typography>

                    <br />

                    <OrderModel
                        item={item}
                        addToCart={addToCart}
                        opened={open}
                        passedOrder={passedOrder}
                        updateOrder={updateOrder}
                    />
                </CardContent>
            </Card>
        </Item>
    );
}
