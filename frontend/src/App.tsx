import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Grid, Paper, Typography, TextField, Button, CircularProgress } from '@mui/material';
import DataTable from 'react-data-table-component';
import { useForm, Controller } from 'react-hook-form';

type TaxPayer = {
  tid: bigint;
  firstName: string;
  lastName: string;
  address: string;
};

const columns = [
  { name: 'TID', selector: (row: TaxPayer) => Number(row.tid), sortable: true },
  { name: 'First Name', selector: (row: TaxPayer) => row.firstName, sortable: true },
  { name: 'Last Name', selector: (row: TaxPayer) => row.lastName, sortable: true },
  { name: 'Address', selector: (row: TaxPayer) => row.address, sortable: true },
];

function App() {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTid, setSearchTid] = useState('');
  const { control, handleSubmit, reset } = useForm<TaxPayer>();

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const fetchTaxPayers = async () => {
    setLoading(true);
    try {
      const result = await backend.getAllTaxPayers();
      setTaxPayers(result.map(tp => ({ ...tp, tid: BigInt(tp.tid) })));
    } catch (error) {
      console.error('Error fetching tax payers:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TaxPayer) => {
    setLoading(true);
    try {
      await backend.createTaxPayer(BigInt(data.tid), data.firstName, data.lastName, data.address);
      reset();
      await fetchTaxPayers();
    } catch (error) {
      console.error('Error creating tax payer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTid) return;
    setLoading(true);
    try {
      const result = await backend.searchTaxPayer(BigInt(searchTid));
      if (result.length > 0) {
        setTaxPayers([{ ...result[0], tid: BigInt(result[0].tid) }]);
      } else {
        setTaxPayers([]);
      }
    } catch (error) {
      console.error('Error searching tax payer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        TaxPayer Management
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper style={{ height: 400, width: '100%' }}>
            <DataTable
              columns={columns}
              data={taxPayers}
              pagination
              progressPending={loading}
              progressComponent={<CircularProgress />}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              Add New TaxPayer
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="tid"
                control={control}
                defaultValue=""
                rules={{ required: 'TID is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="TID"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                rules={{ required: 'First Name is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                rules={{ required: 'Last Name is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{ required: 'Address is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Address"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: 16 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Add TaxPayer'}
              </Button>
            </form>
          </Paper>
          <Paper style={{ padding: 16, marginTop: 16 }}>
            <Typography variant="h6" gutterBottom>
              Search TaxPayer
            </Typography>
            <TextField
              label="TID"
              fullWidth
              margin="normal"
              value={searchTid}
              onChange={(e) => setSearchTid(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: 16 }}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
