import './App.css';
import { useEffect, useState } from 'react';
import { Toolbar, Paper, Container, Box, Typography } from '@mui/material';
import NavTab from './components/Navbars/NavTab';
import ImageBanner from './components/Navbars/ImageBanner';
import { StoreInfo, StoreTimes } from './components/Navbars/shopInfoSection';
import MainMenu from './components/cart/Menu';
import { EditOrder, Order, OrderRecord,apiUrl } from '../shared/common';
import { createHash, compareOrdersMinusTotalandQuantity } from '../shared/util';
import { browserStorage } from '../shared/BrowerStorage';
import OrderSummary from './components/CheckOutPage';
import OrderHistory from './components/OrderHistory';



interface PostOrderResponse {
    orderNumber: string;
    completedOrder: OrderRecord;
}

type OrderHistoryResponse = Map<string, Record<string, Order>>;
const PostOrder = async (cart: Map<string, Order>): Promise<PostOrderResponse> => {
    const url = apiUrl + '/order';

    const payload = {
        order: Object.fromEntries(cart),
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json();

    return data as PostOrderResponse;
};
const GetPastOrders = async (): Promise<OrderHistoryResponse> => {
    const url = apiUrl + '/orders';
    const response = await fetch(url);
    const data = await response.json();
    return data as OrderHistoryResponse;
};
function App() {
    const [cart, setCart] = useState<Map<string, Order>>(new Map([]));
    const [editOrder, setEditOrder] = useState<EditOrder | null>(null);
    const [checkout, setCheckout] = useState<boolean>(false);
    const [completedCart, setCompletedCart] = useState<Map<string, Order>>(new Map([]));
    const [orderNumber, setOrderNumber] = useState<string>('');
    const [pastOrders, setPastOrders] = useState<Map<string, Record<string, Order>>>(new Map([]));
    const [showPastOrders, setShowPastOrders] = useState<boolean>(false);

    useEffect(() => {
        // set  previous cart;
        const previousStoreState = browserStorage.getOrders();

        setCart(previousStoreState);

        // set past orders
    }, []);
    const showHistory = async () => {
        const pastOrders = await GetPastOrders();
        const map = new Map(Object.entries(pastOrders));
        setPastOrders(map);
        setShowPastOrders(true);
    };

    const addToCart = (order: Order) => {
        const orderStr = JSON.stringify(order);

        const hash = createHash(orderStr);
        const allOrders = Array.from(cart.values());
        const isSimilarOrder = allOrders.some(o => compareOrdersMinusTotalandQuantity(o, order));
        const exists = cart.has(hash);

        const olderOrder = allOrders.find(o =>
            compareOrdersMinusTotalandQuantity(o, order),
        ) as Order;
        if (isSimilarOrder) {
            //add to existing order

            if (exists) {
                const same = cart.get(hash) as Order;
                same.quantity += order.quantity;
                addItem(hash, same);

                return;
            }
            addSimilarOrder(order, olderOrder);
            return;
        }
        setCart(new Map([...cart, [hash, order]]));
        browserStorage.addOrder(hash, order);
    };
    const addSimilarOrder = (order: Order, olderOrder: Order) => {
        order.quantity += olderOrder.quantity;
        const updated = order;
        const hash = [...cart.entries()].filter(v =>
            compareOrdersMinusTotalandQuantity(v[1], olderOrder),
        )[0][0];
        addItem(hash, updated);
    };
    const updateOrder = (updated: Order) => {
        addItem(updated.id as string, updated);
    };

    const addItem = (id: string, updated: Order) => {
        const newCart = new Map(cart);
        const Older = newCart.get(id as string);

        if (Older) {
            const updatedOrder = updated as Order;
            updatedOrder.id = undefined;
            newCart.set(id as string, updatedOrder);
            setCart(newCart);
            browserStorage.updateOrder(id as string, updatedOrder);
            setEditOrder(null);
        }
    };
    const deleteFromCart = (id: string) => {
        const newCart = new Map(cart);
        newCart.delete(id);
        setCart(newCart);
        browserStorage.removeOrder(id);
    };

    const editCart = (id: string) => {
        const order = cart.get(id) as Order;

        if (order) {
            order.id = id;
            order.edited = true;

            if (editOrder) {
                const count = editOrder.count + 1;
                console.log(editOrder.count);
                setEditOrder({ editMode: true, order: order, count });
                return;
            }
            setEditOrder({ editMode: true, order: order, count: 1 });
        }
    };

    const handleCheckout = async () => {
        try {
            const order = await PostOrder(cart);
            const orderNumber = order.orderNumber;
            const completedOrder: Map<string, Order> = new Map(
                Object.entries(order.completedOrder[orderNumber]),
            );

            setCheckout(!checkout);
            if (editOrder) {
                editOrder.order.edited = false;
                editOrder.order.id = undefined;
                setEditOrder(editOrder);
            }

            setCompletedCart(completedOrder);
            setOrderNumber(orderNumber);
            setCart(new Map([]));
            clearCart();
        } catch (error) {
            console.log(error);
        }
    };

    const clearCart = () => {
        setCart(new Map([]));
        browserStorage.clearOrders();
        //setEditOrder(null);
    };
    const returnToMenu = () => {
        setCheckout(false);
        setEditOrder(null);
        setShowPastOrders(false);
    };
    return (
        <Container fixed>
            <Paper elevation={15}>
                <NavTab
                    cart={cart}
                    deleteFromCart={deleteFromCart}
                    clearCart={clearCart}
                    editCart={editCart}
                    handleCheckout={handleCheckout}
                    showHistory={showHistory}
                />
            </Paper>
            <Paper elevation={0}>
                <ImageBanner />
            </Paper>
            <Toolbar></Toolbar>
            <Paper elevation={4}>
                <Toolbar variant="regular">
                    <StoreInfo />
                    <Box sx={{ flexGrow: 1 }} />

                    <StoreTimes />
                </Toolbar>
            </Paper>{' '}
            {checkout && !showPastOrders ? (
                <>
                    <Toolbar variant="regular">
                        <Typography variant="h3"></Typography>
                    </Toolbar>

                    <Paper elevation={1}>
                        <OrderSummary
                            basket={completedCart}
                            returnToMenu={returnToMenu}
                            orderNumber={'Order #' + orderNumber}
                        />
                    </Paper>
                </>
            ) : showPastOrders ? (
                <section>
                    <Toolbar variant="regular">
                        <Box sx={{ flexGrow: 1 }} />
                        <Typography variant="h4">Order History</Typography>
                        <Box sx={{ flexGrow: 1 }} />
                    </Toolbar>
                    <Paper elevation={23}>
                        <OrderHistory pastOrders={pastOrders} returnToMenu={returnToMenu} />
                    </Paper>
                </section>
            ) : (
                <section>
                    <Toolbar variant="regular">
                        <Box sx={{ flexGrow: 1 }} />
                        <Typography variant="h4">Menu</Typography>
                        <Box sx={{ flexGrow: 1 }} />
                    </Toolbar>
                    <MainMenu
                        addToCart={addToCart}
                        passedOrder={editOrder || null}
                        updateOrder={updateOrder}
                    />
                </section>
            )}
            <footer></footer>
        </Container>
    );
}

export default App;
