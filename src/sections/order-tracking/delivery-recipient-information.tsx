import { LoadingButton } from '@mui/lab';
import {
  Box,
  DialogActions,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import FormProvider, {
  RHFPhoneInput,
  RHFTextField,
  RHFTitleTextField,
} from 'src/components/hook-form';
import { BlueNotification } from 'src/components/notification';
import { useCheckoutContext } from '../checkout/context';
import { useForm } from 'react-hook-form';
import { endpoints, server_axios } from 'src/utils/axios';
import DeliveryAdresses from './delivery-addresses';
import { useAuthContext } from 'src/auth/hooks';
import { useCallback, useEffect, useState } from 'react';
import { IOrderDeliveryType, IOrderItem } from 'src/types/order';
import CompleteOrderDialogContent from './dialog-content';
import { Actions } from './dialog-action';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { IUserTypes } from 'src/types/user';

import { useSnackbar } from 'src/components/snackbar';
import _ from 'lodash';
import { useBoolean, useBooleanReturnType } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { cancelDialogContent, cancelDialogTitle } from './contants/dialog';
import InputCard from './components/input-card';
import { PrimaryButton } from '../../components/styles/buttons/primary';
import { toEnglishNumber, toPhoneNumberInputFormat } from 'src/utils/change-case';
import { phoneFormatErrorMessage, phoneLengthErrorMessage } from 'src/constants/messages/phone-error-messages';
import { numberRegex } from 'src/constants/regex/number';

interface Props {
  orderId: number;
  delivery_type: IOrderDeliveryType;
  dialog: useBooleanReturnType;
  order: IOrderItem;
}

enum InvoiceOwner {
  me = 'me',
  another = 'another',
}

export function DeliveryRecipientInformation({ orderId, delivery_type, dialog, order }: Props) {
  const [invoiceOwner, setInvoiceOwner] = useState<InvoiceOwner>(InvoiceOwner.me);

  const cancelDialog = useBoolean();

  const { onNextStep } = useCheckoutContext();

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    reciver_name: order?.reciver_name || '',
    reciver_phone: toPhoneNumberInputFormat(order?.reciver_phone) || '۹۸',
    invoice_owner: {
      first_name: order?.invoice_owner?.first_name || '',
      last_name: order?.invoice_owner?.last_name || '',
      id_code: order?.invoice_owner?.id_code || '',
    },
  };

  const Schema = Yup.object().shape({
    reciver_name: Yup.string().required('پرکردن این فیلد اجباری‌ست.'),
    reciver_phone: Yup.string().matches(numberRegex, phoneFormatErrorMessage)
      .transform((value) => toEnglishNumber(value))
      .length(12, phoneLengthErrorMessage)
      .required(phoneLengthErrorMessage),
    invoice_owner: Yup.object().shape({
      first_name: Yup.string().required('پرکردن این فیلد اجباری‌ست.'),
      last_name: Yup.string().required('پرکردن این فیلد اجباری‌ست.'),
      id_code: Yup.string().required('پرکردن این فیلد اجباری‌ست.'),
    }),
  });

  const LegalSchema = Yup.object().shape({
    reciver_name: Yup.string().required('پرکردن این فیلد اجباری‌ست.'),
    reciver_phone: Yup.string().min(13, 'پرکردن این فیلد اجباری‌ست.'),
  });

  const methods = useForm({
    resolver: yupResolver<any>(user?.user_type === IUserTypes.genuine ? Schema : LegalSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isValid, touchedFields },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.info('DATA', data);
      await server_axios.patch(endpoints.orders.update(orderId), data);
      onNextStep();
    } catch (error) {
      console.error(error);
    }
  });

  const values = watch();

  useEffect(() => {
    if (invoiceOwner === InvoiceOwner.me && user) {
      reset({
        ...values,
        invoice_owner: {
          first_name: user.first_name,
          last_name: user.last_name,
          id_code: user.id_code,
        },
      });
    } else {
      reset({
        ...defaultValues,
      });
    }
  }, [invoiceOwner]);

  useEffect(() => {
    if (order?.invoice_owner?.first_name && user?.first_name !== order?.invoice_owner?.first_name)
      setInvoiceOwner(InvoiceOwner.another);
  }, [user]);

  const onBeforeSubmit = useCallback(() => {
    if (!isValid && user?.user_type === IUserTypes.legal) {
      if (!values.reciver_name && values.reciver_phone === '+98')
        enqueueSnackbar('پرکردن فیلدهای اجباری «اطلاعات تحویل‌گیرنده»، الزامی‌ست.', {
          color: 'error',
          variant: 'multiline',
        });
    } else {
      if (
        !values.reciver_name &&
        values.reciver_phone === '+98' &&
        values.invoice_owner.first_name === ''
      ) {
        enqueueSnackbar(
          'پرکردن فیلدهای اجباری «اطلاعات تحویل‌گیرنده» و «مشخصات صاحب فاکتور» الزامی‌ست.',
          {
            color: 'error',
            variant: 'multiline',
          }
        );
      } else if (!values.reciver_name && values.reciver_phone === '+98')
        enqueueSnackbar('پرکردن فیلدهای اجباری «اطلاعات تحویل‌گیرنده»، الزامی‌ست.', {
          color: 'error',
          variant: 'multiline',
        });
    }
    onSubmit();
  }, [isValid, user, values, invoiceOwner]);

  return (
    <>
      <ConfirmDialog
        color="#C80303"
        open={cancelDialog.value}
        onClose={() => {
          dialog.onFalse();
          cancelDialog.onFalse();
        }}
        title={cancelDialogTitle}
        content={cancelDialogContent}
        closeTitle='خیر'
        action={
          <PrimaryButton
            size={'medium'}
            onClick={() => {
              onSubmit();
              cancelDialog.onFalse();
              dialog.onFalse();
            }}
          >
            بله
          </PrimaryButton>
        }
      />

      <CompleteOrderDialogContent>
        {/* <CompleteOrderLayout> */}
          <Stack spacing={'24px'}>
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <InputCard title="اطلاعات تحویل گیرنده">
                <Box
                  columnGap={2}
                  rowGap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFTitleTextField
                    name="reciver_name"
                    custom_label="نام و نام خانوادگی"
                    placeholder="افزودن محتوا"
                  />
                  <RHFPhoneInput
                    name="reciver_phone"
                    custom_label={'شماره تماس'}
                  />
                </Box>
                {/* </Stack> */}
              </InputCard>
            </FormProvider>

            {delivery_type === IOrderDeliveryType.tehran && <DeliveryAdresses orderId={orderId} />}

            {user?.user_type === IUserTypes.genuine && (
              <FormProvider methods={methods} onSubmit={onSubmit}>
                <InputCard title="مشخصات صاحب فاکتور">
                  <BlueNotification sx={{ mt: 2 }}>
                    می‌توانید فاکتور را به نام خود و یا فرد دیگری انتخاب کنید.
                  </BlueNotification>
                  <Stack
                    direction={'row'}
                    sx={{
                      p: '8px',
                      borderRadius: '12px',
                      bgcolor: '#F2F2F2',
                      textAlign: 'center',
                      fontFamily: 'peyda-bold',
                      my: 2,
                    }}
                  >
                    <Box
                      onClick={() => setInvoiceOwner(InvoiceOwner.me)}
                      sx={{
                        width: '50%',
                        py: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        bgcolor: '#F2F2F2',
                        color: '#727272',
                        ...(invoiceOwner === InvoiceOwner.me && {
                          color: '#000',
                          bgcolor: '#FFF',
                          border: '1px solid #D1D1D1',
                          boxShadow:
                            '0px 0.8px 1.8px 0px #0000001C, 0px 0.15px 0.5px 0px #0000001C',
                        }),
                      }}
                    >
                      به نام خودم
                    </Box>
                    <Box
                      onClick={() => setInvoiceOwner(InvoiceOwner.another)}
                      sx={{
                        width: '50%',
                        py: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        bgcolor: '#F2F2F2',
                        color: '#727272',
                        ...(invoiceOwner === InvoiceOwner.another && {
                          color: '#000',
                          bgcolor: '#FFF',
                          border: '1px solid #D1D1D1',
                          boxShadow:
                            '0px 0.8px 1.8px 0px #0000001C, 0px 0.15px 0.5px 0px #0000001C',
                        }),
                      }}
                    >
                      به نام فرد دیگر
                    </Box>
                  </Stack>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)',
                    }}
                    sx={{ mt: '24px' }}
                    spacing={'16px'}
                  >
                    <RHFTitleTextField
                      name="invoice_owner.first_name"
                      custom_label="نام"
                      placeholder="افزودن محتوا"
                    />
                    <RHFTitleTextField
                      name="invoice_owner.last_name"
                      custom_label="نام خانوادگی"
                      placeholder="افزودن محتوا"
                    />
                    <RHFTitleTextField
                      name="invoice_owner.id_code"
                      custom_label="کد ملی"
                      placeholder="افزودن محتوا"
                    />
                  </Stack>
                </InputCard>
              </FormProvider>
            )}
          </Stack>
        {/* </CompleteOrderLayout> */}
      </CompleteOrderDialogContent>
      {/* <FormProvider methods={methods} onSubmit={onSubmit}> */}
      <Actions
        onCancel={() => {
          if (_.keys(touchedFields).length) {
            cancelDialog.onTrue();
          } else {
            dialog.onFalse();
          }
        }}
        onSubmit={onBeforeSubmit}
      />
      {/* </FormProvider> */}
    </>
  );
}
