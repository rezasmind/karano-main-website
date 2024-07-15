import { Box, Typography } from "@mui/material";
import { useCheckoutContext } from "../checkout/context";
import { Stack } from "@mui/system";
import { StyledRoundedWhiteButton } from "src/components/styles/props/rounded-white-button";
import { LoadingButton } from "@mui/lab";
import { IInvoice } from "src/types/invoice";
import { RHFTitleTextField } from "src/components/hook-form";
import { useBooleanReturnType } from "src/hooks/use-boolean";
import { endpoints, server_axios } from "src/utils/axios";
import { OrderStatus } from "src/types/order";
import { useEffect } from "react";

interface Props {
    orderId: number
    finalOrderDialog: useBooleanReturnType
    hasCustomMade: boolean
    need_prepayment: boolean
    submitHandler: () => void
}

export default function Payment({ 
    finalOrderDialog, hasCustomMade, orderId, need_prepayment,
    submitHandler
 }: Props) {
    const checkout = useCheckoutContext();

    useEffect(() => {
        if (need_prepayment){ 
            submitHandler();
            handle();
        }
    }, [need_prepayment])

    const handle = async () => {
        await server_axios.patch(endpoints.orders.update(orderId), {
            status: (hasCustomMade) ? OrderStatus.production : OrderStatus.ready_to_send
        })
        finalOrderDialog.onFalse()
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ width: 1, pb: 2, fontFamily: 'peyda-bold', borderBottom: '1px solid #D1D1D1' }}>
                پیش پرداخت
            </Typography>
            <Box sx={{ border: '2px solid #A9A9A9', borderRadius: '16px', p: 4, my: 4 }}>
                <Typography variant="h4" sx={{ width: 1, pb: 2, fontFamily: 'peyda-bold', borderBottom: '1px solid #D1D1D1' }}>
                    مشخصات صاحب فاکتور
                </Typography>
                <Typography variant="body2" sx={{ width: 1, py: 2, fontFamily: 'peyda-regular' }}>
                    در صورت داشتن کد تخفیف، آن را وارد کنید.
                </Typography>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        md: 'repeat(2, 1fr)',
                    }}
                    sx={{ mt: 2 }}
                    spacing={2}
                >
                    {/* <RHFTitleTextField name='first_name' custom_label='کد تخفیف' placeholder='666784' /> */}
                </Stack>
            </Box>
            <Stack sx={{ mt: 2 }} direction={'row'} spacing={1} justifyContent={'end'}>
                <StyledRoundedWhiteButton variant='outlined' sx={{ px: 4 }} onClick={() => checkout.onBackStep()}>مرحله قبل</StyledRoundedWhiteButton>
                <LoadingButton variant='contained' sx={{ borderRadius: '24px', px: 4 }} onClick={() => handle()}>ثبت و ادامه</LoadingButton>
            </Stack>
        </Box>
    )
}