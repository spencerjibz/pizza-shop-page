import {
    CardHeader,
    Toolbar,
    Button,
    CardContent,
    Collapse,
    IconButton,
    Paper,
} from '@mui/material';
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import * as React from 'react';
import { CostPerSize } from '../../shared/common';
export interface OrderSummaryProps {
    basket: Map<string, Order>;
    returnToMenu?: () => void;
}

import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Order } from '../../shared/common';

export interface OrderSummaryProps {
    basket: Map<string, Order>;
    orderNumber: string;
    returnToMenu?: () => void;
    checkout?: boolean;
}

function OrderSummary({ basket, returnToMenu, orderNumber, checkout = true }: OrderSummaryProps) {
    const [open, setOpen] = useState(false);
    const totalPrice = Array.from(basket.values()).reduce((total, order) => total + order.total, 0);

    return (
        <TableContainer>
            <CardHeader title={orderNumber} />
            <CardContent>
                <Paper elevation={0}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell> Unit Price </TableCell>
                                <TableCell> Order total </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from(basket.entries()).map(([name, order]) => (
                                <React.Fragment key={name}>
                                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                        <TableCell component="th" scope="row">
                                            <IconButton
                                                aria-label="expand row"
                                                size="small"
                                                onClick={() => setOpen(!open)}
                                            >
                                                {open ? (
                                                    <KeyboardArrowUpIcon />
                                                ) : (
                                                    <KeyboardArrowDownIcon />
                                                )}
                                            </IconButton>{' '}
                                            {order.size} {order.item.name} Pizza{' '}
                                        </TableCell>

                                        <TableCell> x {order.quantity}</TableCell>
                                        <TableCell>£{CostPerSize[order.size].price}</TableCell>
                                        <TableCell>£{order.total.toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell
                                            style={{ paddingBottom: 0, paddingTop: 0 }}
                                            colSpan={3}
                                        >
                                            <Collapse in={open} timeout="auto" unmountOnExit>
                                                <Table size="medium">
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell> Extra Toppings:</TableCell>
                                                            <TableCell>
                                                                {order.extra
                                                                    .map(v => v.name)
                                                                    .join(', ')}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Instructions:</TableCell>
                                                            <TableCell>
                                                                {order.specialInstructions}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                            <TableRow>
                                <TableCell colSpan={2}>Total Price:</TableCell>
                                <TableCell>£{totalPrice.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
                {checkout && <p>Thank you for your order!</p>}
            </CardContent>
            {checkout && (
                <Toolbar>
                    <Button onClick={returnToMenu}>Return to menu</Button>
                </Toolbar>
            )}
        </TableContainer>
    );
}

export default OrderSummary;
