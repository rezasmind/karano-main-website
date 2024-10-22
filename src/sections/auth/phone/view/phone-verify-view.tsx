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

  const renderForm = (
    <Stack spacing={2.5}>

      <Typography variant="body1" fontFamily={'peyda-bold'} mt={3} textAlign={'left'}>کد تایید به شماره {" " + phone + " "} ارسال شد.</Typography>

      <Link variant="body2" href={paths.auth.phone.login} fontFamily={'peyda-bold'} color="#0B7BA7" underline="none" sx={{ alignSelf: 'flex-end', cursor: 'pointer' }}>
        تغییر شماره
      </Link>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" mb={1} fontFamily={'peyda-bold'} textAlign={'left'}>کد تایید</Typography>
        <RHFCode name="code" sx={{ direction: 'rtl' }} helperText={'دریافت مجدد کد پس از ۰۲:۵۹ '} />
      </Box>

      <LoadingButton
        sx={{ borderRadius: '24px', fontFamily: 'peyda-bold' }}
        disabled={values.code?.length !== 6}
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
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
