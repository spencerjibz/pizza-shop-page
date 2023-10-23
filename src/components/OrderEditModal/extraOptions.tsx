import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Stack,
    Checkbox,
} from '@mui/material';

import { Item } from '../../../shared/util';
import { Topping } from '../../../shared/common';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
interface ToppingMenuProps {
    toppings: Topping[];
    updateToppings: (event: React.ChangeEvent<HTMLInputElement>) => void;
    heading: string;
}

function ToppingsMenu({ toppings, updateToppings, heading }: ToppingMenuProps) {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>{heading}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack>
                    {toppings.map((topping, index) => (
                        <Item key={index}>
                            <Checkbox
                                checked={topping.selected}
                                name={topping.name}
                                onChange={updateToppings}
                            />
                            {topping.name}
                        </Item>
                    ))}
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}

export default ToppingsMenu;
