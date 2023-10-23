import { IconButton, CardContent, Badge, Card, Typography } from '@mui/material';

import { Star } from '@mui/icons-material';
const times: string[] = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri'];
const StoreTimes = () => {
    return (
        <Card variant="elevation">
            <CardContent>
                <Typography variant="h6">
                    <strong>Opening Times:</strong>
                </Typography>
                {times.map((time, index) => (
                    <Typography key={index}>{time + '  ' + ' 6:00pm - 11:00pm '}</Typography>
                ))}
            </CardContent>
        </Card>
    );
};

const StoreInfo = () => {
    return (
        <Card variant="elevation">
            <CardContent
                sx={{
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="body2" color="text.primary" fontSize="15px">
                    27 The Grove <br />
                    London <br />
                    NW24 5OD
                </Typography>
                <IconButton size="large" aria-label="4 stars" color="inherit">
                    <Star fontSize="small"></Star>
                </IconButton>

                <Badge badgeContent={4.6} color="primary"></Badge>
                <Typography>(200 ratings). </Typography>
            </CardContent>
        </Card>
    );
};

export { StoreInfo, StoreTimes };
