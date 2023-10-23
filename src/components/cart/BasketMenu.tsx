import * as React from 'react';
import {
    Menu,
    MenuItem,
    Paper,
    Box,
    IconButton,
    Badge,
    Typography,
    Button,
    Toolbar,
} from '@mui/material';
import { Order } from '../../../shared/common';
import { ShoppingBasketSharp, ClearAll, HistorySharp } from '@mui/icons-material';
import OrderSummary from './CartOrderItem';
interface BasketMenuProps {
    basket: Map<string, Order>;
    deleteFromCart: (id: string) => void;
    clearCart: () => void;
    editCart: (id: string) => void;
    handleCheckout: () => void;
    showHistory: () => void;
}
export default function BasketMenu({
    basket,
    deleteFromCart,
    clearCart,
    editCart,
    handleCheckout,
    showHistory,
}: BasketMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (basket.size === 0) return;
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    let total = 0;
    let totalKcal = 0;
    basket.forEach(order => {
        total += order.total;
        totalKcal += order.item.KCal * order.quantity;
    });
    return (
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
                size="large"
                color="inherit"
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <Badge badgeContent={basket.size} color="error">
                    <ShoppingBasketSharp fontSize="large" />
                </Badge>
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />
            <IconButton size="large" color="inherit" onClick={showHistory}>
                <HistorySharp fontSize="large" />
            </IconButton>
            <Paper elevation={15} sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    {' '}
                    {basket.size ? (
                        <div>
                            <OrderSummary
                                basket={basket}
                                deleteFromCart={deleteFromCart}
                                editCart={editCart}
                            />

                            <MenuItem>
                                <Typography variant="h6">
                                    <Box>
                                        <Typography variant="body1">
                                            Total: £{total.toFixed(2)}{' '}
                                        </Typography>

                                        <Typography variant="body1">
                                            Serving: {totalKcal} kcal
                                        </Typography>
                                        <Typography variant="body1">
                                            Number of Orders: {basket.size}
                                        </Typography>
                                    </Box>
                                </Typography>
                            </MenuItem>

                            <Toolbar>
                                <Button size="small" variant="contained" onClick={handleCheckout}>
                                    Place Order
                                </Button>
                                <Box sx={{ flexGrow: 1 }}></Box>

                                <Button size="small" onClick={clearCart} endIcon={<ClearAll />}>
                                    Clear Cart
                                </Button>
                            </Toolbar>
                        </div>
                    ) : null}
                </Menu>
            </Paper>
        </Box>
    );
}
