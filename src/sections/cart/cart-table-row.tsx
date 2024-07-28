import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';
import Label from 'src/components/label';
import { ConfirmDialog, DialogWithButton } from 'src/components/custom-dialog';

import { ICartItem } from 'src/types/cart';
import SvgColor from '../../components/svg-color';
import { Stack, Typography } from '@mui/material';
import { IOrderProductPropertyStatus } from 'src/types/order-products-property';

// ----------------------------------------------------------------------

type Props = {
  row: ICartItem;
  selected?: boolean;
  type?: 'cart' | 'edit';
  onEditRow?: VoidFunction;
  onDeleteRow?: VoidFunction;
};

export default function CartTableRow({
  row,
  selected,
  type,
  onDeleteRow,
  onEditRow,
}: Props) {
  const {
    status,
    coating,
    dimensions,
    final_coating,
    frame_type,
    profile_type,
    quality,
    rejection_reason
  } = row;

  const confirm = useBoolean();

  const rejectionDialog = useBoolean();

  return (
    <>
      <DialogWithButton fullWith={true} dialog={rejectionDialog}>
        <Typography variant="h4" sx={{ width: 1, pb: 2, fontFamily: 'peyda-bold', borderBottom: '1px solid #D1D1D1' }}>
          علت رد ‌سفارش
        </Typography>
        <Typography variant='body2' py={3} color={"#727272"}>دلایل رد سفارش شما به همراه راه‌حل‌های احتمالی برای اصلاح سفارش را در متن زیر بیان شده است.</Typography>
        <Typography variant='body2' pt={3} fontFamily={'peyda-bold'}>
          توضیحات ادمین
        </Typography>
        <Box mt={2} bgcolor={"#F8F8F8"} border={'1px solid #E0E0E0'} borderRadius={'12px'} p={2}>
          <Typography variant='body2' color={"#727272"}>
            {rejection_reason}
          </Typography>
        </Box>

      </DialogWithButton>
      <TableRow
        hover
        sx={{
          ...(selected && {
            border: '2px solid #000'
          })
        }}
      >

        {(!!profile_type) && (
          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
            {profile_type}
            {(status === IOrderProductPropertyStatus.denied) && (
              <Label color='error' className='my-first-step' sx={{ ml: 1, px: 1 }}>رد شده</Label>
            )}
            {(status === IOrderProductPropertyStatus.edited) && (
              <Label color='warning' sx={{ ml: 1, px: 1 }}>اصلاح شده</Label>
            )}
            {(status === IOrderProductPropertyStatus.approve) && (
              <Label color='success' sx={{ ml: 1, px: 1 }}>تایید شده</Label>
            )}
          </TableCell>
        )}

        {(!!final_coating) && (
          <TableCell>
            {final_coating}
          </TableCell>
        )}

        {(!!frame_type) && (
          <TableCell>
            {frame_type}
          </TableCell>
        )}

        {(!!coating) && (
          <TableCell>
            {coating}
          </TableCell>
        )}

        <TableCell>
          {dimensions}
        </TableCell>

        <TableCell sx={{}}>
          <Box sx={{ display: 'flex', alignItems: 'center', fontFamily: 'peyda-medium' }}>
            {quality}
            {(rejection_reason) && (
              <Box
                sx={{
                  ml: 1, borderRadius: '50px', border: '1px solid #D1D1D1', fontSize: '0.75rem', textWrap: 'nowrap', pl: 1.5, pr: 1.5, display: 'flex', alignItems: 'center', py: 0.5, cursor: 'pointer'
                }}
                className={'reason'}
                onClick={rejectionDialog.onTrue}
              >
                <SvgColor src='/assets/icons/admin-panel/info-circle.svg' sx={{ width: 16, height: 16, mr: 0.5 }} />
                <Box pt={0.25}>
                  مشاهده علت
                </Box>
              </Box>
            )}
          </Box>
        </TableCell>

        <TableCell align="right">
          <Stack direction={'row'}>
            {(onEditRow && status !== IOrderProductPropertyStatus.approve) && (
              <IconButton color={'default'} onClick={onEditRow} className='edit'>
                <SvgColor src='/assets/icons/cart/edit.svg' sx={{ width: 16, height: 16 }} />
              </IconButton>
            )}
            {(onDeleteRow && status !== IOrderProductPropertyStatus.approve) && (
              <IconButton color={'default'} onClick={confirm.onTrue} className='del' disabled={!!selected}>
                <SvgColor src='/assets/icons/cart/trash.svg' sx={{ width: 16, height: 16 }} />
              </IconButton>
            )}
          </Stack>
          {/* <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}

        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="حذف آیتم از سبد خرید"
        content="آیا مطمئن هستید؟"
        action={
          <Button variant="contained" color="error" onClick={() => {
            if (onDeleteRow) onDeleteRow();
            confirm.onFalse();
          }}>
            تایید
          </Button>
        }
      />
    </>
  );
}
