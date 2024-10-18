"use client";

import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { DialogWithButton, SuccessDialog } from "src/components/custom-dialog";
import { useBoolean } from "src/hooks/use-boolean";
import CompleteOrderView from "./complete-order-view";
import { useGetTrackingOrders } from "src/api/orders";
import TrackingOrderItem from "./tracking-order-item";
import { useCallback, useEffect, useState } from "react";
import ShoppingCartList from "src/sections/shopping-cart/shopping-cart-list";
import { useGetOrderProducts } from "src/api/order-products";
import { endpoints, server_axios } from "src/utils/axios";
import { IOrderItem, OrderStatus } from "src/types/order";
import { ProductOrderType } from "src/types/product";
import OrderRejectionListView from "./order-rejection-list-view";
import { LoadingButton } from "@mui/lab";
import { StyledRoundedWhiteButton } from "src/components/styles/props/rounded-white-button";
import SvgColor from "src/components/svg-color";

import { useSnackbar } from 'src/components/snackbar';

export default function OrderTrackingListView() {
    const [orderId, setOrderId] = useState<number>(0);
    const [order, setOrder] = useState<IOrderItem>();
    const [hasCustomMade, setHasCustomMade] = useState(false);
    const [prePayment, setPrePayment] = useState(false);

    const orderRejectingDialog = useBoolean();
    const cartDialog = useBoolean();
    const finalOrderDialog = useBoolean();
    const finalPaymentDialog = useBoolean();

    const successDialog = useBoolean();
    const successFinalPaymentDialog = useBoolean();

    const { enqueueSnackbar } = useSnackbar();

    const {
        orders,
        refreshOrders
    } = useGetTrackingOrders();
    const { orderProducts } = useGetOrderProducts(orderId);

    useEffect(() => {
        if (orderProducts.length) {
            if (orderProducts.some((op) => op.product.order_type === ProductOrderType.custom_made))
                setHasCustomMade(true);
            else
                setHasCustomMade(false);
        }
    }, [orderProducts, orderId]);

    useEffect(() => {
        setOrder(orders.find((o) => o.id === orderId))
    }, [orderId])

    const handleMore = (id: number, status: OrderStatus) => {
        setOrderId(id);
        if (status === OrderStatus.failed) {
            orderRejectingDialog.onTrue();
        } else if (status === OrderStatus.accepted) {
            finalOrderDialog.onTrue();
        } else if (status === OrderStatus.produced) {
            finalPaymentDialog.onTrue()
        } else {
            cartDialog.onTrue();
        }
    };

    const handleConfirmSubmitDialog = (need_prepayment: boolean) => {
        setPrePayment(need_prepayment)
        // if (need_prepayment) {
        //     submitSuccessDialog.onTrue();
        // } else {
        successDialog.onTrue();
        // }
    }

    const pay = useCallback(async () => {
        // let hasReadyProduct = false;
        // if (orderProducts.some((op) => op.product.order_type === ProductOrderType.ready_to_use))
        //     hasReadyProduct = true

        await server_axios.patch(endpoints.orders.update(orderId), {
            status: hasCustomMade ? OrderStatus.production : OrderStatus.preparing
        })
        finalPaymentDialog.onFalse();
        successFinalPaymentDialog.onTrue();

        const order = orders.find((o) => o.id === orderId);
    }, [orderProducts, orders, hasCustomMade]);

    const handleDownloadFactor = useCallback(async () => {
        enqueueSnackbar('فاکتور نهایی سفارش شما با موفقیت دانلود شد.', {
            variant: 'myCustomVariant',
            color: 'info'
        })
    }, []);

    return (
        <Box>

            {/* <SuccessDialog
                title="ثبت موفق"
                content={hasCustomMade ?
                    `سفارش شما با کد ${orders.find((o) => o.id === orderId)?.order_number || ''}، با موفقیت ثبت شد و وارد فرایند تولید می‌شود.`
                    : `سفارش شما با کد ${orders.find((o) => o.id === orderId)?.order_number || ''}، با موفقیت ثبت شد.`}
                open={submitSuccessDialog.value}
                onClose={submitSuccessDialog.onFalse}
            /> */}

            <SuccessDialog
                title={prePayment ? "ثبت موفق" : "پرداخت موفق"}
                content={hasCustomMade ?
                    `سفارش شما با کد ${orders.find((o) => o.id === orderId)?.order_number || ''}، با موفقیت ثبت شد و وارد فرایند تولید می‌شود.`
                    : `سفارش شما با کد ${orders.find((o) => o.id === orderId)?.order_number || ''}، با موفقیت ثبت شد.`}
                open={successDialog.value}
                onClose={successDialog.onFalse}
            />

            {/* final payment success dialog */}
            <SuccessDialog
                title={"پرداخت موفق"}
                content={`پرداخت شما برای سفارش کد ${orders.find((o) => o.id === orderId)?.order_number || ''}، با موفقیت انجام شد و  به زودی ارسال می‌شود. `}
                open={successFinalPaymentDialog.value}
                onClose={successFinalPaymentDialog.onFalse}
            />

            <DialogWithButton dialog={finalPaymentDialog} fullWith={false} width={800}>
                <Box p={4}>
                    <Stack direction={"row"} borderBottom={'1px solid #1D1D1D'} pb={2} justifyContent={"space-between"}>
                        <Typography variant="h4" fontFamily={'peyda-bold'}>پرداخت نهایی</Typography>
                        <Button
                            sx={{ color: "#0B7BA7", fontFamily: "peyda-bold", fontSize: '16px' }}
                            onClick={handleDownloadFactor}
                        >
                            <SvgColor src="/assets/icons/orders/download-01.svg" sx={{ mr: 0.5 }} />
                            دانلود فاکتور نهایی
                        </Button>
                    </Stack>
                    <Typography variant="body1" fontFamily={'peyda-regular'} color={"#727272"} py={4}>
                        می‌بایست برای نهایی‌کردن سفارش خود، مبلغ باقی‌مانده فاکتور خود را پرداخت کنید.
                    </Typography>
                    <Stack direction={"row"}>
                        <Typography fontFamily={'peyda-bold'}>
                            مبلغ قابل پرداخت:
                        </Typography>
                        <Typography fontFamily={'peyda-bold'} px={1}>1455555</Typography>
                        <Typography color={"#727272"} fontFamily={'peyda-light'}>ریال</Typography>
                    </Stack>
                    <Stack direction={'row'} justifyContent={'end'} pt={4} spacing={1}>
                        <StyledRoundedWhiteButton variant='outlined' onClick={finalPaymentDialog.onFalse} sx={{ px: 3 }}>انصراف</StyledRoundedWhiteButton>
                        <LoadingButton variant='contained' sx={{ borderRadius: '24px', px: 4 }} onClick={() => pay()}>پرداخت</LoadingButton>
                    </Stack>
                </Box>
            </DialogWithButton>

            <CompleteOrderView
                orderId={orderId}
                finalOrderDialog={finalOrderDialog}
                hasCustomMade={hasCustomMade}
                handleAfterLastSection={(n) => handleConfirmSubmitDialog(n)}
            />

            <DialogWithButton dialog={cartDialog} fullWith={true}>
                <Box p={4}>
                    <Stack direction={'row'} justifyContent={'space-between'} borderBottom={'1px solid #D1D1D1'}>
                        <Stack direction={'row'} spacing={2}>
                            <Typography variant="h4" sx={{ pb: 2, fontFamily: 'peyda-bold' }}>
                                {'سبدخرید'}
                            </Typography>
                        </Stack>
                        <Box>
                            <Tooltip title="دانلود سبد خرید" arrow>
                                <Button sx={{
                                    '&:hover': {
                                        bgcolor: '#F2F2F2'
                                    },
                                    minWidth: 'fit-content'
                                }} size="small">
                                    <SvgColor src="/assets/icons/orders/download-01.svg" />
                                </Button>
                            </Tooltip>
                        </Box>

                    </Stack>
                    <ShoppingCartList
                        type="view"
                        items={orderProducts}
                    />
                </Box>
            </DialogWithButton>

            <DialogWithButton dialog={orderRejectingDialog} fullWith={true}>
                <OrderRejectionListView
                    dialog={orderRejectingDialog}
                    orderId={orderId}
                    order_number={order?.order_number}
                    onUpdate={() => refreshOrders()}
                />
            </DialogWithButton>

            <Stack spacing={4} pb={10}>
                {orders.map((order) => (
                    <TrackingOrderItem
                        key={order.id}
                        order={order}
                        handleMoreBtn={handleMore}
                    />
                ))}
            </Stack>
        </Box>
    )
}