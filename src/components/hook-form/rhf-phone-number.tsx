import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField, Box, Typography, Stack } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import SvgColor from '../svg-color';

type RHFPhoneInputProps = {
  name: string;
  custom_label: string;
  helperText?: string;
};

export default function RHFPhoneInput({ name, custom_label, helperText }: RHFPhoneInputProps) {
  const { control } = useFormContext();

  const handleChange = (index: number, value: string, onChange: (value: string) => void, currentValue: string) => {
    const newValue = currentValue.split(' ');
    newValue[index] = value.replace(/\D/g, '');
    onChange(newValue.join(' '));

    // Auto-focus next input
    if ((value.length === (index < 3 ? 3 : 4)) && (index >= 1 && index < 3)) {
      const nextInput = document.getElementById(`phone-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    } else if (value.length >= 2 && index === 0) {
      const nextInput = document.getElementById(`phone-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    } else if (value.length === 0 && index !== 0) {
      const prevInput = document.getElementById(`phone-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number, value: string, maxLength: number) => {
    const currentValue = value.split(' ')[index];
    if ((event.key === 'Backspace' || event.keyCode === 8)) {
      if (currentValue !== '') return
      const prevInput = document.getElementById(`phone-input-${index - 1}`);
      prevInput?.focus();
    } else {
      if (currentValue?.length === maxLength) {
        const prevInput = document.getElementById(`phone-input-${index + 1}`);
        prevInput?.focus();
      }
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        pattern: {
          value: /^\+\d{3} \d{3} \d{3} \d{4}$/,
          message: 'Invalid phone number format'
        }
      }}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <Typography fontFamily={'peyda-bold'} sx={{ mb: '8px', display: 'block' }} variant='body3'>{custom_label}</Typography>
          <Box display="flex" sx={{ direction: 'rtl' }} alignItems={'center'} border={!error ? '1px solid #D1D1D1' : '1px solid #FF5630'} borderRadius={'8px'} px={'12px'}>
            <Box display={'flex'} alignItems={'center'} sx={{ color: '#919EAB' }}>
              +
              <TextField
                id="phone-input-0"
                inputProps={{ maxLength: 2 }}
                disabled
                placeholder="xx"
                value={field.value.split(' ')[0] || ''}
                onChange={(e) => handleChange(0, e.target.value, field.onChange, field.value)}
                InputProps={{
                  sx: {
                    '&.Mui-disabled': {
                      background: 'transparent!important'
                    },
                    '& input': {
                      px: 0
                    },
                  }
                }}
                sx={{
                  width: '30px',
                  '&.Mui-disabled': {
                    background: 'transparent!important'
                  },
                  '& fieldset': {
                    border: 'none',
                  },
                  '& input': {
                    padding: 0
                  }
                }}
              />

            </Box>
            <TextField
              id="phone-input-1"
              inputProps={{ maxLength: 3 }}
              placeholder="xxx"
              value={field.value.split(' ')[1] || ''}
              onKeyDown={(e) => handleOnKeyDown(e, 1, field.value, 3)}
              onChange={(e) => handleChange(1, e.target.value, field.onChange, field.value)}
              InputProps={{
                sx: {
                  '& input': { px: 0 },
                }
              }}
              sx={{
                width: '40px',
                '& fieldset': {
                  border: 'none',
                }
              }}
            />
            <TextField
              id="phone-input-2"
              inputProps={{ maxLength: 3 }}
              placeholder="xxx"
              value={field.value.split(' ')[2] || ''}
              onKeyDown={(e) => handleOnKeyDown(e, 2, field.value, 3)}
              onChange={(e) => handleChange(2, e.target.value, field.onChange, field.value)}
              InputProps={{
                sx: {
                  '& input': { px: 0 },
                }
              }}
              sx={{
                width: '40px',
                '& fieldset': {
                  border: 'none',
                }
              }}
            />
            <TextField
              id="phone-input-3"
              inputProps={{ maxLength: 4 }}
              placeholder="xxxx"
              value={field.value.split(' ')[3] || ''}
              onKeyDown={(e) => handleOnKeyDown(e, 3, field.value, 4)}
              onChange={(e) => handleChange(3, e.target.value, field.onChange, field.value)}
              InputProps={{
                sx: {
                  '& input': { px: 0 },
                }
              }}
              sx={{
                width: '50px',
                '& fieldset': {
                  border: 'none',
                }
              }}
            />
          </Box>

          {error && (
            <Stack direction={'row'} alignItems={'center'}>
              <SvgColor src='/assets/icons/input/alert-circle.svg' color={'#C80303'} />
              <Typography fontFamily={'peyda-regular'} variant='body2' ml={0.5} mt={1}>{error?.message}</Typography>
            </Stack>
          )}
        </Box>
      )}
    />
  );
}