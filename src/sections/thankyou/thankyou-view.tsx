/* eslint-disable perfectionist/sort-imports */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { Logo } from 'src/components/logo';
import { useParams } from 'react-router-dom';
import { createInvoice } from 'src/redux/apiRequest';
import { useDispatch } from 'react-redux';
import Cookie from 'js-cookie';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

export function ThankYouView() {
  const { id, amount, method } = useParams();
  const dispatch = useDispatch();
  const accessToken = Cookie.get('access_token');

  const handleCreateInvoice = async () => {
    const data = await createInvoice(
      accessToken,
      { appointment_id: id, total_amount: amount, payment_method: method },
      dispatch
    );
    if (data) {
      toast.success('Create invoice successfully.');
    }
  };

  useEffect(() => {
    handleCreateInvoice();
  }, []);

  return (
    <>
      <Logo sx={{ position: 'fixed', top: 20, left: 20 }} />

      <Container
        sx={{
          py: 10,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ mb: 2 }}>
          Thank you for your payment!
        </Typography>

        <Typography sx={{ color: 'text.secondary', maxWidth: 520 }}>
          We appreciate your trust in our service. Your appointment has been successfully confirmed.
          We look forward to serving you soon!
        </Typography>

        <Box
          component="img"
          src="https://static.vecteezy.com/system/resources/previews/015/235/166/non_2x/thank-you-text-button-thank-you-sign-icon-label-sticker-web-buttons-vector.jpg"
          alt="Thank you illustration"
          sx={{
            width: 320,
            height: 'auto',
            my: { xs: 5, sm: 8 },
          }}
        />

        <Button component={RouterLink} href="/" size="large" variant="contained" color="primary">
          Back to home
        </Button>
      </Container>
    </>
  );
}
