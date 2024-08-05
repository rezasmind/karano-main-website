'use client';

import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';

import FormProvider, { RHFCode,  } from 'src/components/hook-form';
import { Box } from '@mui/material';
import RegisterLoginHead from '../register-login-head';

// ----------------------------------------------------------------------

export default function PhoneVerifyView() {
  const { verify } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const phone = searchParams.get('phone');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    // password: Yup.string().required('کد را وارد کنید').min(6, 'کد باید حداقل 6 کرکتر باشد'),
    code: Yup.string().required('کد را وارد کنید').length(6, 'کد باید حداقل 6 کرکتر باشد'),
  });

  const defaultValues = {
    code: ''
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      await verify?.(`+${phone}`, data.code);

      // const response = await server_axios.post(endpoints.auth.user.verify, { phone: `+${phone}`, code: data.code })
      //   .then((res) => {
      //     return res.data
      //   });

      // await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  useEffect(() => {
    if (values.code)
      if (values.code.length === 6) {
        onSubmit();
      }
  }, [values.code])

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 4 }}>
      <Box sx={{ borderBottom: '1px solid #D1D1D1' }}>
        <Typography variant="h4" textAlign={'center'} fontFamily={'peyda-bold'} sx={{ pb: 3 }}>ثبت نام | ورود</Typography>
      </Box>

      {/* <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
          Create an account
        </Link>
      </Stack> */}
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {/* {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>} */}

      <Typography variant="body1" fontFamily={'peyda-bold'} textAlign={'left'}>کد تایید به شماره {" " + phone + " "} ارسال شد.</Typography>

      <Link variant="body2" href={paths.auth.phone.login} fontFamily={'peyda-bold'} color="#0B7BA7" underline="none" sx={{ alignSelf: 'flex-end', cursor: 'pointer' }}>
        تغییر شماره
      </Link>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" mb={1} fontFamily={'peyda-bold'} textAlign={'left'}>کد تایید</Typography>
        {/* <OTPInput /> */}
        <RHFCode name="code" sx={{ direction: 'rtl' }} helperText={'بعد از 2:59 میتوانید مجدد درخواست دهید'} />
        {/* <RHFTextField
          name="phone"
          // label="Password"
          sx={{
            justifyContent: 'center',
            '& input': {
              textAlign: 'center',
              direction: 'rtl'
            }
          }}
          type={'text'}
          helperText={'بعد از 2:59 میتوانید مجدد درخواست دهید'}
        />
        <OTPInput /> */}
      </Box>


      {/* <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link> */}

      <LoadingButton
        sx={{ borderRadius: '24px', fontFamily: 'peyda-bold' }}
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      // loading={true}
      >
        {isSubmitting ? '' : 'ادامه'}
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <RegisterLoginHead back />

      {renderForm}

    </FormProvider>
  );
}
