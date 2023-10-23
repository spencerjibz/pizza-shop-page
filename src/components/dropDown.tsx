import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
interface DropDownProps {
    items: string[];
    defaultItem?: string;
    callback?: (value: string) => void;
}

function DropDown({ items, defaultItem, callback }: DropDownProps) {
    const [size, setSize] = useState<string>(defaultItem ? defaultItem : '');
    const handleChange = (event: SelectChangeEvent) => {
        setSize(event.target.value);
        if (callback) {
            callback(event.target.value);
        }
    };

    return (
        <Select variant="standard" value={size} onChange={handleChange}>
            {items.map((item, index) => (
                <MenuItem value={item} key={index}>
                    {item}
                </MenuItem>
            ))}
        </Select>
    );
}

export default DropDown;
