import { Box, Toolbar, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { Order } from '../../../shared/common';
import BasketMenu from '../cart/BasketMenu';
interface NavTabProps {
    cart: Map<string, Order>;
    deleteFromCart: (id: string) => void;
    clearCart: () => void;
    editCart: (id: string) => void;
    handleCheckout: () => void;
    showHistory: () => void;
}

function NavTab({
    cart,
    deleteFromCart,
    clearCart,
    editCart,
    handleCheckout,
    showHistory,
}: NavTabProps) {
    const [basket, setBasket] = useState<Map<string, Order>>(new Map());

    useEffect(() => {
        setBasket(new Map(cart));
    }, [cart]);

    return (
        <Paper sx={{ flexGrow: 1 }}>
            <Toolbar>
                <Typography variant="h3">Pluto's Pizza</Typography>

                <Box sx={{ flexGrow: 1 }} />
                <BasketMenu
                    basket={basket}
                    deleteFromCart={deleteFromCart}
                    clearCart={clearCart}
                    editCart={editCart}
                    handleCheckout={handleCheckout}
                    showHistory={showHistory}
                />
            </Toolbar>
        </Paper>
    );
}

export default NavTab;
