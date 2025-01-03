import { Button, Box, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { m } from 'framer-motion';
import { MouseEventHandler, useCallback, useState } from 'react';
import SvgColor from 'src/components/svg-color';
import { pxToRem } from 'src/theme/typography';

const SecondaryButtonStyle = styled(Button)<ButtonProps>(({ theme, size, color }) => {
  const sizeSm = size === 'small';
  const sizeMd = size === 'medium';

  return {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: `${pxToRem(4)} ${pxToRem(20)}`,
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    ...(!color && {
      outline: '1px solid #D1D1D1',
      '&:hover': {
        outline: '1px solid #727272',
        backgroundColor: '#fff!important',
        border: 'none'
      },
    }),
    ...(color === 'error' && {
      color: '#C80303',
      outline: '1px solid #C80303',
      '&:hover': {
        color: '#780202',
        outline: '1px solid #780202',
        backgroundColor: '#fff!important',
        border: 'none'
      },
    }),
    ...(color === 'info' && {
      color: '#0B7BA7',
      outline: '1px solid #0B7BA7',
      '&:hover': {
        color: '#00364B',
        outline: '1px solid #00364B',
        backgroundColor: '#fff!important',
        border: 'none'
      }
    }),
    ...(sizeSm && {
      minWidth: '102px',
      padding: `${pxToRem(4)} ${pxToRem(12)}`,
      height: '36px',
      ...theme.typography.button2,
    }),
    ...(sizeMd && {
      minWidth: '122px',
      padding: `${pxToRem(4)} ${pxToRem(24)}`,
      ...theme.typography.button1,
    }),
    '&.Mui-disabled': {
      backgroundColor: 'transparent',
      color: '#E0E0E0',
      outline: '1px solid #E0E0E0'
    },
    '&:active': {
      color: '#005878',
      outline: '1px solid #005878',
    },
  };
});

type Props = ButtonProps & {
  onClick?: MouseEventHandler<HTMLElement>;
  children?: React.ReactNode;
  isSubmiting?: boolean;
  startIcon?: React.ReactElement | null;
  endIcon?: React.ReactElement | null;
};

export const SecondaryButton = ({
  onClick,
  children,
  isSubmiting = false,
  startIcon,
  endIcon,
  ...other
}: Props) => {
  const [submiting, setIsSubmiting] = useState(isSubmiting);

  const handleOnClick: MouseEventHandler<HTMLElement> = useCallback(
    async (event) => {
      if (onClick) {
        setIsSubmiting(true);
        try {
          onClick(event);
        } finally {
          setIsSubmiting(false);
        }
      }
    },
    [onClick]
  );

  const iconStyles = {
    width: 16,
    height: 16,
    '& svg, img': { width: 1, height: 1, objectFit: 'cover' },
  };

  return (
    <SecondaryButtonStyle onClick={handleOnClick} disabled={submiting} {...other}>
      {startIcon && <Box sx={{ mr: 0.75, ...iconStyles }}> {startIcon} </Box>}

      {submiting ? (
        <Box
          component={m.div}
          animate={{ rotate: 360 }}
          transition={{ ease: 'linear', duration: 2, repeat: Infinity }}
          sx={{ width: 24, height: 24, my: '8px' }}
        >
          <SvgColor src="/assets/icons/buttons/loader-anim.svg" sx={{ width: 24, height: 24 }} />
        </Box>
      ) : (
        children
      )}

      {endIcon && <Box sx={{ ml: 0.75, ...iconStyles }}> {endIcon} </Box>}
    </SecondaryButtonStyle>
  );
};
