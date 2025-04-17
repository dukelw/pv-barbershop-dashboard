/* eslint-disable perfectionist/sort-imports */
import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  TableRow,
  TableCell,
  TableHead,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import { getAllInvoices } from 'src/redux/apiRequest';

// PDF export
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function InvoiceView() {
  const currentUser = useSelector((state: any) => state.user.signin.currentUser);
  const accessToken = Cookie.get('access_token');
  const userID = Cookie.get('_id');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const table = useTable();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const handleGetInvoice = async () => {
    const data = await getAllInvoices(true, dispatch);
    console.log(data);
    setInvoices(data);
  };
  const capitalizeFirstLetter = (text: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleExport = (invoice: any) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('INVOICE', 80, 20);

    doc.setFontSize(12);
    doc.text(`Customer: ${invoice?.appointment.customer_name}`, 14, 35);
    doc.text(`Payment Method: ${invoice?.payment_method}`, 14, 45);
    doc.text(`Created At: ${new Date(invoice?.createdAt).toLocaleString('vi-VN')}`, 14, 55);
    doc.text(`Total Amount: ${invoice?.total_amount?.toLocaleString('vi-VN')} VND`, 14, 65);
    doc.save(`invoice_${invoice?._id}.pdf`);
  };

  useEffect(() => {
    handleGetInvoice();
  }, []);

  const filteredData = invoices.filter((d) =>
    d.appointment.customer_name.toLowerCase().includes(search)
  );

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Invoices
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '40px' }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </Box>
      </Box>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Customer</b>
                  </TableCell>
                  <TableCell>
                    <b>Price</b>
                  </TableCell>
                  <TableCell>
                    <b>Payment Method</b>
                  </TableCell>
                  <TableCell>
                    <b>Created At</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  ?.slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  ?.map((invoice) => (
                    <TableRow key={invoice?._id}>
                      <TableCell>{invoice?.appointment.customer_name}</TableCell>
                      <TableCell>{invoice?.total_amount}</TableCell>
                      <TableCell>{capitalizeFirstLetter(invoice?.payment_method)}</TableCell>
                      <TableCell>{new Date(invoice?.createdAt).toLocaleString('vi-VN')}</TableCell>
                      <TableCell>
                        <Button
                          sx={{ minWidth: '80px', marginTop: '4px' }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleExport(invoice)}
                        >
                          Export
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={invoices?.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
