import {
    MenuItem,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    Stack,
    Button,
    Toolbar,
    Box,
} from '@mui/material';
import { Order } from '../../shared/common';
import { ExpandMore, DeleteForever, Edit } from '@mui/icons-material';

interface CartOrderSummaryProps {
    basket: Map<string, Order>;
    deleteFromCart: (id: string) => void;
    editCart: (id: string) => void;
}

function CartOrderSummary({ basket, deleteFromCart, editCart }: CartOrderSummaryProps) {
    return (
        <Stack>
            {Array.from(basket).map(([id, order]) => {
                const Ien = order.item.ingredients.length;
                const ToppingsLen = order.extra.length;
                const mainIngredients =
                    Ien > 2
                        ? order.item.ingredients.slice(0, 3)
                        : order.item.ingredients.slice(0, 2);
                const remainingIngredients = order.item.ingredients.slice(3, Ien);
                const mainToppings =
                    ToppingsLen > 2 ? order.extra.slice(0, 3) : order.extra.slice(0, 2);

                const remainningToppings = order.extra.slice(3, ToppingsLen);
                console.log(remainingIngredients,mainIngredients)

                return (
                    <MenuItem key={id}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>{` ${order.quantity} x ${order.size} ${order.item.name} -  £${order.total} `}</Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Typography variant="body1">
                                    Main toppings: {mainIngredients.join(', ')}{' '}
                                    {remainingIngredients.length > 1
                                        ? ' and ' + remainingIngredients.length + ' more ...'
                                        : ''}
                                </Typography>
                                <Typography variant="body2">
                                    {ToppingsLen
                                        ? 'Extra Toppings: ' +
                                          mainToppings.map(v => v.name).join(', ')
                                        : null}{' '}
                                    {remainningToppings.length
                                        ? ' and ' + remainningToppings.length + ' more ...'
                                        : null}
                                </Typography>
                                <br />
                                <Typography variant="body2">{order.specialInstructions}</Typography>
                            </AccordionDetails>

                            <Toolbar>
                                <Button
                                    variant="text"
                                    endIcon={<Edit />}
                                    onClick={() => editCart(id)}
                                >
                                    edit
                                </Button>
                                <Box sx={{ flexGrow: 1 }}></Box>

                                <Button variant="outlined" onClick={() => deleteFromCart(id)}>
                                    <DeleteForever />
                                </Button>
                            </Toolbar>
                        </Accordion>
                    </MenuItem>
                );
            })}
        </Stack>
    );
}

export default CartOrderSummary;
