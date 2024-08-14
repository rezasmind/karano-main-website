'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Box, MenuItem, MenuItemProps, Select, styled } from '@mui/material';
import { countries } from 'src/assets/data';
import { paths } from 'src/routes/paths';
import axiosInstance, { endpoints, server_axios } from 'src/utils/axios';
import RegisterLoginHead from '../register-login-head';

// ----------------------------------------------------------------------

export default function PhoneLoginView() {

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    phone: Yup.string().length(13, 'شماره تلفن باید 13 کلمه باشد').required('شماره تماس مورد نیاز است'),
  });

  const defaultValues = {
    phone: '+98',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await server_axios.post(endpoints.auth.user.loginSignUp, data).then(({ data }) => data)
      
      if (!res.phone_verified) {
        router.push(paths.auth.phone.verify + '?phone=' + data.phone.split("+")[1]);
        return
      }
      
      if (!res.set_password) {
        router.push(paths.auth.phone.newPassword + '?user_id=' + res.user_id);
        return
      }

      if (!res.complete_information) {
        router.push(paths.auth.phone.register + '?user_id=' + res.user_id);
        return
      }

      if (res.authenticated) {
        router.push(paths.auth.phone.password + '?phone=' + data.phone.split("+")[1]);
      } else {
        router.push(paths.auth.phone.verify + '?phone=' + data.phone.split("+")[1]);
      }
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

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
    <Stack spacing={4} width={1} mt={7}>

      <Box>
        <Typography variant="h6" textAlign={'left'} mb={0.5}>شماره تلفن همراه</Typography>

        <RHFTextField
          name="phone"
          sx={{
            '.MuiInputBase-input': {
              textAlign: 'right!important',
              direction: 'rtl!important'
            }
          }}
          type={'text'}
          placeholder='09123456789'
          onChange={(e) => {
            console.log(e.target.value)
            if (!e.target.value.startsWith('+98')) {
              methods.setValue('phone', '+98')
            } else {
              methods.setValue('phone', e.target.value)
            }
          }}
        />

      </Box>


      {/* <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link> */}

      <LoadingButton
        sx={{ borderRadius: '24px', fontFamily: 'peyda-bold' }}
        fullWidth
        color="inherit"
        size="large"
        // disabled={true}
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        ادامه
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <RegisterLoginHead />

      {renderForm}

    </FormProvider>
  );
}