import { useState } from 'react';
import {
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Toolbar,
    Box,
    Table,
    TableContainer,
    Button,
} from '@mui/material';
import { ExpandMore, ArrowBackIosNew } from '@mui/icons-material';
import { Order } from '../../shared/common';
import OrderSummary from './CheckOutPage';
interface OrderHistoryProps {
    pastOrders: Map<string, Record<string, Order>>;
    returnToMenu: () => void;
}
const OrderHistory = ({ pastOrders, returnToMenu }: OrderHistoryProps) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                {Array.from(pastOrders?.entries() || [])
                    .sort((a, b) => Number(b[0]) - Number(a[0]))
                    .map(([orderNumber, order]) => (
                        <Accordion key={orderNumber}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                onClick={handleClick}
                            >
                                {' '}
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    {`Order #${orderNumber}`}{' '}
                                </Typography>
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    {new Date(Number(orderNumber)).toDateString()}
                                </Typography>
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    {new Date(Number(orderNumber)).toLocaleTimeString()}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <OrderSummary
                                    basket={new Map(Object.entries(order))}
                                    orderNumber={''}
                                    checkout={false}
                                />
                            </AccordionDetails>
                        </Accordion>
                    ))}
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                        variant="contained"
                        onClick={returnToMenu}
                        startIcon={<ArrowBackIosNew />}
                    >
                        {' '}
                        Return to Menu{' '}
                    </Button>
                </Toolbar>
            </Table>
        </TableContainer>
    );
};

export default OrderHistory;
