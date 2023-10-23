import { createTheme, Stack, styled } from '@mui/material';
import { createContext } from 'react';
import { EditOrder } from './common';
import { Order } from './common';
import { SHA1 } from 'crypto-js';
/* eslint-disable */
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
});

export const Item = styled(Stack)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export const createHash = (str: string) => {
    return SHA1(str).toString();
};

export const compareOrdersMinusTotalandQuantity = (a: Order, b: Order) => {
    const deepCopyA = JSON.parse(JSON.stringify(a));
    const deepCopyB = JSON.parse(JSON.stringify(b));
    deepCopyA.id = undefined;
    deepCopyB.id = undefined;
    deepCopyA.edited = false;
    deepCopyB.edited = false;
    deepCopyA.item.id = undefined;
    deepCopyB.item.id = undefined;
    deepCopyA.total = 0;
    deepCopyA.quantity = 0;
    deepCopyB.total = 0;
    deepCopyB.quantity = 0;

    return JSON.stringify(deepCopyA) === JSON.stringify(deepCopyB);
};
export const EditOrderContext = createContext<EditOrder | null>(null);
