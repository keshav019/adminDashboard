
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Row from './TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Checkbox, Container, IconButton, InputBase, TableCell, TableHead, TableRow, Toolbar, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
const headCells = [
    {
        id: 'name',
        label: 'Name',
    },
    {
        id: 'email',
        label: 'Email',
    },
    {
        id: 'role',
        label: 'Role',
    },
    {
        id: 'action',
        label: 'Action',
    }
];



export default function Home() {
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const rowsPerPage = 10;

    const handleCheckboxChange = (row) => {
        const selectedIndex = selected.findIndex((selectedRow) => selectedRow.name === row.name);

        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, row);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };


    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        setSelected(selectAll ? [] : [...filteredRows.slice(page * rowsPerPage, (page + 1) * rowsPerPage)]);
    };
    const deleteSelected = () => {
        const updatedRows = rows.filter((row) => !selected.some((selectedRow) => selectedRow.name === row.name));
        setRows(updatedRows);
        setSelected([]);
        setSelectAll(false);
    };
    const handleDeleteClick = (row) => {
        const updatedRows = rows.filter((r) => r.name !== row.name);
        setRows(updatedRows);
        if (selected.some((selectedRow) => selectedRow.name === row.name)) {
            const updatedSelected = selected.filter((selectedRow) => selectedRow.name !== row.name);
            setSelected(updatedSelected);
        }
    };
    const handleSaveClick = (editedValues) => {
        const updatedRows = rows.map((row) =>
            row.id === editedValues.id ? { ...row, ...editedValues } : row
        );
        console.log(editedValues);
        setRows(updatedRows);
    };

    const fetchData = async () => {
        const { data } = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
        setRows(data);
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        setPage(0); // Reset page when search value changes
    };

    const handleChangePage = (val) => {
        setPage(page + val);
    };

    const handleGoToFirstPage = () => {
        setPage(0);
    };

    const handleGoToLastPage = () => {
        setPage(Math.ceil(rows.length / rowsPerPage) - 1);
    };

    useEffect(() => {
        fetchData();
    }, []);

    var filteredRows = rows.filter((row) => row.name.toLowerCase().includes(searchValue.toLowerCase()) || row.email.toLowerCase().includes(searchValue.toLowerCase()))

    return (
        <Container>
            <Box sx={{ width: '100%' }}>
                <Toolbar
                    sx={{
                        pl: { sm: 2 },
                        pr: { xs: 1, sm: 1 },
                    }}
                >
                    {selected.length > 0 ? (
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', }}>
                            <div>
                                <Typography
                                    sx={{ flex: '1 1 100%' }}
                                    color="inherit"
                                    variant="subtitle1"
                                    component="div"
                                >
                                    {selected.length} selected
                                </Typography>
                            </div>
                            <div>
                                <Tooltip title="Delete" disableHoverListener={selected.length > 0} onClick={deleteSelected}>
                                    <IconButton>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    ) : (
                        <>
                            <InputBase
                                placeholder="Search"
                                value={searchValue}
                                onChange={handleSearchChange}
                                sx={{
                                    flex: '1 1 100%',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    padding: '8px',
                                    maxWidth: '300px'
                                }}
                            />


                        </>
                    )}
                </Toolbar>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={selectAll}
                                        onChange={handleSelectAllChange}
                                    />
                                </TableCell>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                    >
                                        {headCell.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row, index) => (
                                <Row
                                    key={index}
                                    row={row}
                                    selected={selected.some((selectedRow) => selectedRow.name === row.name)}
                                    onCheckboxChange={handleCheckboxChange}
                                    deleteClick={handleDeleteClick}
                                    saveClick={handleSaveClick}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    rowsPerPageOptions={[]}
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={10}
                    page={page}
                    onPageChange={() => { }}
                    ActionsComponent={() => (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton onClick={handleGoToFirstPage} disabled={page === 0}>
                                <FirstPageIcon />
                            </IconButton>
                            <IconButton onClick={() => handleChangePage(-1)} disabled={page === 0}>
                                <NavigateBeforeIcon />
                            </IconButton>
                            <IconButton onClick={() => handleChangePage(1)} disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}>
                                <NavigateNextIcon />
                            </IconButton>
                            <IconButton onClick={handleGoToLastPage} disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}>
                                <LastPageIcon />
                            </IconButton>
                        </div>
                    )}
                />
            </Box>
        </Container>
    );
}
