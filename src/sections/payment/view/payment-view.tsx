/* eslint-disable perfectionist/sort-imports */
import { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, Stack, Avatar, Divider } from '@mui/material';
import { redirect, useParams } from 'react-router-dom';
import Cookie from 'js-cookie';
import { useDispatch } from 'react-redux';

import { DashboardContent } from 'src/layouts/dashboard';
import { getAppointment } from 'src/redux/apiRequest';
import { QRCodeSVG } from 'qrcode.react';

export function PaymentView() {
  const accessToken = Cookie.get('access_token');
  const { id } = useParams();
  const dispatch = useDispatch();
  const [appointment, setAppointment] = useState<any>(null);
  const [method, setMethod] = useState<'cash' | 'momo' | null>(null);
  const [payUrl, setPayUrl] = useState<string | null>(null);
  const [payQr, setPayQr] = useState<string>('');

  const handleGetAppointment = async () => {
    const data = await getAppointment(id, dispatch, true);
    setAppointment(data.metadata);
  };

  const handleMomoPayment = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}payment/momo`, {
        method: 'POST',
        body: JSON.stringify({
          amount: totalPrice.toString(),
          redirectUrl: `${import.meta.env.VITE_REACT_APP_DASHBOARD_URL}thankyou/${appointment._id}/${totalPrice}/momo`,
          orderInfo: `Thanh toán hóa đơn của ${appointment.user_name}`,
        }),
        headers: {
          'Content-Type': 'application/json',
          authorization: accessToken,
        },
      });

      const result = await res.json();
      console.log('result', result);

      if (result) {
        setPayUrl(result.link);
        setPayQr(result.qr);
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi thanh toán Momo');
      console.error(err);
    }
  };

  useEffect(() => {
    handleGetAppointment();
  }, []);

  if (!appointment) return <DashboardContent>Đang tải dữ liệu...</DashboardContent>;

  const totalPrice = appointment.service.reduce((acc: number, s: any) => acc + s.service_price, 0);

  return (
    <DashboardContent>
      <Card sx={{ p: 3, mx: 'auto', minWidth: '800px' }}>
        <Typography variant="h5" gutterBottom>
          Thanh toán
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar src={appointment.barber?.user_avatar} />
          <Box>
            <Typography fontWeight="bold">{appointment.customer_name}</Typography>
            <Typography fontSize="0.875rem" color="text.secondary">
              Thợ: {appointment.barber?.user_name}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {appointment.service.map((s: any) => (
          <Box key={s._id} sx={{ mb: 1 }}>
            <Typography>{s.service_name}</Typography>
            <Typography fontSize="0.875rem" color="text.secondary">
              {s.service_price.toLocaleString('vi-VN')}đ
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight="bold">Tổng cộng: {totalPrice.toLocaleString('vi-VN')}đ</Typography>

        <Box sx={{ mt: 3 }}>
          <Typography fontWeight="medium" sx={{ mb: 1 }}>
            Chọn phương thức thanh toán:
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant={method === 'cash' ? 'contained' : 'outlined'}
              onClick={() => setMethod('cash')}
            >
              Tiền mặt
            </Button>

            <Button
              variant={method === 'momo' ? 'contained' : 'outlined'}
              onClick={() => setMethod('momo')}
            >
              Momo
            </Button>
          </Stack>

          {method === 'cash' && (
            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3 }}
              onClick={() => {
                const url = `${import.meta.env.VITE_REACT_APP_DASHBOARD_URL}thankyou/${appointment._id}/${totalPrice}/cash`;
                window.location.href = url;
              }}
            >
              Xác nhận thanh toán
            </Button>
          )}

          {method === 'momo' && payUrl && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography fontWeight="medium" sx={{ mb: 1 }}>
                Quét mã để thanh toán:
              </Typography>
              <QRCodeSVG value={payQr} size={200} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Hoặc nhấn vào{' '}
                <a
                  href={payUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1976d2' }}
                >
                  liên kết này
                </a>
              </Typography>
            </Box>
          )}

          {method === 'momo' && (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={handleMomoPayment}
            >
              Thanh toán qua Momo
            </Button>
          )}
        </Box>
      </Card>
    </DashboardContent>
  );
}
