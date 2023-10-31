import express from 'express';
import cors from 'cors';
import { OrderRecord, PORT } from '../shared/common.ts';
import fs from 'fs';
import { fileStorage } from '../shared/FileStorage.ts';

const port = PORT || 8000;
const app = express();
// middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// check for a build
const buildPath = process.cwd() + '/dist';
if (fs.existsSync(buildPath)) {
    app.use(express.static('dist'));

    app.get('/', (req, res) => {
        console.log(req.path);
        res.sendFile('index.html', { root: 'dist' });
    });
}
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

app.listen(port, () => console.log('Server running on port', port));
