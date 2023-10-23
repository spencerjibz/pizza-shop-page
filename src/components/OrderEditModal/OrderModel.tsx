import { useState, useEffect, ChangeEvent } from 'react';
import { TextareaAutosize } from '@mui/base';
import {
    AddCircleOutlineOutlined,
    RemoveCircleOutlineOutlined,
    AddShoppingCartOutlined,
} from '@mui/icons-material';
import DropDown from './dropDown';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Stack,
    Card,
    CardHeader,
    CardContent,
    Paper,
    IconButton,
    Toolbar,
    Box,
    Alert,
} from '@mui/material';

import {
    PizzaType,
    CostPerSize,
    extraToppings,
    CostPerExtraTopping,
    Topping,
    Order,
} from '../../../shared/common';
import ToppingsMenu from './extraOptions';
import { Item } from '../../../shared/util';

interface OrderModelProps {
    item: PizzaType;
    opened?: boolean;
    addToCart: (order: Order) => void;
    updateOrder: (updated: Order) => void;
    passedOrder?: Order | null;
}

function OrderModel({
    item,
    addToCart,
    updateOrder,
    passedOrder,
    opened = false,
}: OrderModelProps) {
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);
    const [sizes, setSizes] = useState<string[]>([]);
    const [toppings, setToppings] = useState<Topping[]>([]);
    const [includedToppings, setIncludedToppings] = useState<string[]>([]);
    const [defaultSize, setDefaultSize] = useState<string | undefined>();

    useEffect(() => {
        const data = Object.entries(CostPerSize).map(
            ([key, value]) => `${key} ${value.inches}" ${value.price}`,
        );
        setSizes(data);
        const TopTwotoppings = item.ingredients.slice(0, 2);
        const defaultOrder = passedOrder
            ? passedOrder
            : ({
                  item: item,
                  quantity: 1,
                  size: 'Small',
                  total: CostPerSize.Small.price,
                  extra: [],
              } as Order);

        const sizeValue = data.find(v => v.includes(defaultOrder.size));

        setDefaultSize(sizeValue);

        setIncludedToppings([...new Set(TopTwotoppings)]);
        setOrder(defaultOrder);
        const toppings: Topping[] = extraToppings.map(topping => ({
            selected: passedOrder && passedOrder.extra.some(v => v.name === topping) ? true : false,
            price: CostPerExtraTopping,
            name: topping,
        }));
        setToppings(toppings);
        setOpen(opened);
    }, [item, passedOrder, opened]);
    // [item, item, item]
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };
    const handleSizeChange = (value: string) => {
        const size = value.split(' ')[0] as keyof typeof CostPerSize;
        const price = CostPerSize[size].price;

        if (order) {
            const total = (price + addToppings(toppings)) * order?.quantity;

            const TopTwotoppings = item.ingredients.slice(0, 2);
            if (TopTwotoppings.length < 2) {
                TopTwotoppings.push('Spinach');
            }
            switch (size) {
                case 'Medium': {
                    let extraIngredients = TopTwotoppings.concat('Sweetcorn');
                    extraIngredients = [...new Set(extraIngredients)];
                    setIncludedToppings(extraIngredients);
                    setOrder({
                        ...order,
                        size,
                        total: Number(total.toFixed(2)),
                        item: { ...order.item, ingredients: extraIngredients },
                    });

                    break;
                }
                case 'Large': {
                    let extraIngredients = TopTwotoppings.concat(
                        'Sweetcorn',
                        'Mushrooms',
                        `extra ${item.ingredients[1]}`,
                    );
                    extraIngredients = [...new Set(extraIngredients)];
                    setIncludedToppings(extraIngredients);
                    setOrder({
                        ...order,
                        size,
                        total: Number(total.toFixed(2)),
                        item: { ...order.item, ingredients: extraIngredients },
                    });
                    break;
                }
                default:
                    setIncludedToppings(TopTwotoppings);
                    setOrder({
                        ...order,
                        size: size,
                        total: Number(total.toFixed(2)),
                    });
            }
        }
    };
    //setOrder(null);
    const updateOrderQuantity = (decrement = false) => {
        const increment = decrement ? -1 : 1;

        if (order && order.quantity + increment > 0) {
            const quantity = order.quantity + increment;
            const size = order.size as keyof typeof CostPerSize;
            const price = CostPerSize[size].price;
            const total = (price + addToppings(toppings)) * quantity;

            setOrder({
                ...order,
                quantity,
                total: Number(total.toFixed(2)),
            });
        }
    };

    const addToppings = (toppings: Topping[]) => {
        const totalExtras = toppings
            .filter(v => v.selected)
            .reduce((acc, topping) => acc + topping.price, 0);
        // update the Kcal

        return totalExtras;
    };

    const updateToppings = (event: ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;

        const newToppings = [...new Set(toppings.map(v => JSON.stringify(v)))]
            .map(e => JSON.parse(e))
            .map(topping => {
                if (topping.name === event.target.name) {
                    topping.selected = checked;
                }
                return topping;
            });

        setToppings(newToppings);
        if (order) {
            const totalExtras = addToppings(newToppings);

            const size = order.size as keyof typeof CostPerSize;
            const price = CostPerSize[size].price;

            const total = (totalExtras + price) * order.quantity;

            setOrder({
                ...order,
                extra: newToppings.filter(topping => topping.selected),
                total: Number(total.toFixed(2)),
            });
        }
    };

    const addToBasket = () => {
        if (!order) return;
        addToCart(order);
        CleanUp();
    };
    const updateBasket = () => {
        if (order) {
            updateOrder(order);

            CleanUp();
            setOpen(false);
        }
    };

    const addSpecialInstructions = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (order) {
            setOrder({
                ...order,
                specialInstructions: event.target.value,
            });
        }
    };
    const CleanUp = () => {
        if (order) {
            setOrder({
                ...order,
                extra: [],
                quantity: 1,
                size: 'Small',
                total: CostPerSize.Small.price,
            });
            setToppings([...new Set(toppings)].map(topping => ({ ...topping, selected: false })));
            setIncludedToppings([...new Set(item.ingredients)]);
            setOpen(false);
        }
    };
    const editMode = order?.edited && order.id;

    return (
        <Item>
            <Button variant="outlined" onClick={handleClickOpen}>
                Order
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {' '}
                <Paper elevation={15}>
                    <DialogTitle id="alert-dialog-title">{'Order Details'}</DialogTitle>
                    <DialogContent>
                        <Card>
                            <CardHeader
                                variant="h6"
                                title={item.name}
                                fontSize="center"
                            ></CardHeader>

                            <CardContent>
                                <Typography>{item.description}</Typography>
                                <br />
                                <Alert severity="warning">
                                    <Typography variant="body2">
                                        Allergens: {item.allergens.join(', ')}
                                    </Typography>
                                </Alert>
                                <br />
                                <Typography>
                                    {' '}
                                    <strong>Toppings Included</strong> :{' '}
                                    {includedToppings.join(', ')}
                                </Typography>
                            </CardContent>
                        </Card>

                        <Stack>
                            <Item>
                                Pizza:{' '}
                                <DropDown
                                    items={sizes}
                                    defaultItem={defaultSize || sizes[0]}
                                    callback={handleSizeChange}
                                />
                            </Item>
                            <Item>
                                <ToppingsMenu
                                    heading="Extra Toppings (£1.49 Each)"
                                    toppings={toppings}
                                    updateToppings={updateToppings}
                                ></ToppingsMenu>
                            </Item>
                            <Item>
                                <Toolbar>
                                    <Typography>Quantity: {order?.quantity}</Typography>
                                    <IconButton onClick={() => updateOrderQuantity(false)}>
                                        <AddCircleOutlineOutlined fontSize="small" />
                                    </IconButton>

                                    <IconButton onClick={() => updateOrderQuantity(true)}>
                                        <RemoveCircleOutlineOutlined fontSize="small" />
                                    </IconButton>
                                </Toolbar>
                            </Item>
                            <Item>
                                <TextareaAutosize
                                    aria-label="Enter Special Notes"
                                    placeholder="Enter Special Notes or instructions here"
                                    onChange={addSpecialInstructions}
                                />
                            </Item>
                        </Stack>

                        <Card>
                            <CardHeader title="Current Summary" />
                            <CardContent>
                                <Typography> Price : £{order?.total} </Typography>
                                <Typography> Quantity : {order?.quantity} </Typography>
                                <Typography> Size : {order?.size} </Typography>
                                <Typography>
                                    {order?.extra && order.extra.length ? 'extras:' : null}{' '}
                                    {order?.extra.map(v => v.name).join(', ')}{' '}
                                </Typography>
                            </CardContent>
                        </Card>
                    </DialogContent>

                    <Toolbar>
                        <Button
                            variant="text"
                            onClick={editMode ? updateBasket : addToBasket}
                            startIcon={<AddShoppingCartOutlined />}
                        >
                            {editMode ? 'Update Item or Close' : 'Add to Basket'}
                        </Button>
                        <Box sx={{ flexGrow: 1 }}></Box>
                        {!editMode && (
                            <Button variant="outlined" onClick={handleClose}>
                                Close
                            </Button>
                        )}
                    </Toolbar>
                </Paper>
            </Dialog>
        </Item>
    );
}

export default OrderModel;


