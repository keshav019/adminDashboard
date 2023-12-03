import { useState } from 'react';
import { Checkbox, TableCell, TableRow, IconButton, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Row({ row, selected, selectAll, onCheckboxChange, deleteClick, saveClick }) {
    const [isEditMode, setEditMode] = useState(false);
    const [editedValues, setEditedValues] = useState({ id: row.id, name: row.name, email: row.email, role: row.role });

    const handleCheckboxChange = () => {
        onCheckboxChange(row);
    };
    const handleDeleteClick = () => {
        deleteClick(row);
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleCancelClick = () => {
        setEditMode(false);
    };
    const handleSaveClick = () => {
        saveClick(editedValues);
        setEditMode(false);
    };

    const handleInputChange = (e) => {
        setEditedValues({ ...editedValues, [e.target.name]: e.target.value });
    };

    return (
        <TableRow sx={{ cursor: 'pointer', backgroundColor: selected ? '#f0f0f0' : 'inherit', marginTop: '1px' }}>
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    checked={selected}
                    onChange={handleCheckboxChange}
                />
            </TableCell>
            {isEditMode ? (
                <>
                    <TableCell>
                        <TextField
                            name="name"
                            value={editedValues.name}
                            onChange={handleInputChange}
                            sx={{ padding: '1px' }}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            name="email"
                            value={editedValues.email}
                            onChange={handleInputChange}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            name="role"
                            value={editedValues.role}
                            onChange={handleInputChange}
                        />
                    </TableCell>
                    <TableCell>
                        <Button onClick={handleSaveClick} color="primary">Save</Button>
                        <Button onClick={handleCancelClick} color="secondary">Cancel</Button>
                    </TableCell>
                </>
            ) : (
                <>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                        <IconButton color="primary" onClick={handleEditClick} disabled={selected || selectAll}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={handleDeleteClick} disabled={selected || selectAll}>
                            <DeleteIcon />
                        </IconButton>
                    </TableCell>
                </>
            )}
        </TableRow>
    );
}

export default Row;
