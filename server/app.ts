import express from 'express';
import cors from 'cors';
import { OrderRecord } from '../shared/common.ts';

import { fileStorage } from '../shared/FileStorage.ts';

const PORT = 8000;
const app = express();
// middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/order', (req, res) => {
    let { order } = req.body;

    order = order as OrderRecord;
    if (!order) return res.status(400).send('No order posted');
    const orderNumber = new Date().valueOf().toString();

    try {
        fileStorage.addOrder(orderNumber, order);
        res.json({ orderNumber: orderNumber, completedOrder: { [orderNumber]: order } });
    } catch (e: unknown) {
        e instanceof Error && res.status(500).send(e.message);
    }
});

app.get('/api/orders', (_, res) => {
    const orders = fileStorage.getOrders();
    res.json(orders);
});

app.listen(PORT, () => console.log('Server running on port', PORT));