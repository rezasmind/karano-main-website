import { LoadingButton } from "@mui/lab";
import { Box, DialogActions, DialogContent, Stack, Typography } from "@mui/material";
import { BlueNotification, YellowNotification } from "src/components/notification";
import { StyledRoundedWhiteButton } from "src/components/styles/props/rounded-white-button";
import { useBoolean, useBooleanReturnType } from "src/hooks/use-boolean";
import React, { useEffect } from "react";
import ShoppingCartList from "../shopping-cart/shopping-cart-list";
import { IOrderProductItem } from "src/types/order-products";

import { useSnackbar } from "src/components/snackbar";
import { IOrderProductPropertyStatus } from "src/types/order-products-property";
import { endpoints, server_axios } from "src/utils/axios";
import { OrderStatus } from "src/types/order";
import { ReminderDialog } from "src/components/custom-dialog";
import Scrollbar from "src/components/scrollbar";

interface Props {
    orderProducts: IOrderProductItem[]
    dialog: useBooleanReturnType
    orderId: number
}

export default function OrderRejectionListView({
    orderProducts,
    dialog,
    orderId
}: Props) {
    const reminderDialog = useBoolean(true);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
    }, [])

    const handleUpdateOrder = async () => {
        const op = await server_axios.get(endpoints.orderProducts.one(orderId)).then(({ data }) => data)
        if (op.find((item: any) => item.properties.find((property: any) => property.status === IOrderProductPropertyStatus.denied))) {
            const text = "یکی یا چندتا از سفارش‌ها در وضعیت «ردشده» است. تغییرات مورد نظر را اعمال کنید و سپس بر روی دکمه ثبت نهایی کلیک کنید."
            enqueueSnackbar(text, {
                variant: "error"
            })
            return
        }
        await server_axios.patch(endpoints.orders.update(orderId), {
            status: OrderStatus.edited
        })
        dialog.onFalse();
    }

    return (
        <React.Fragment>
            {/* <ReminderDialog
                color="#727272"
                onClose={reminderDialog.onFalse}
                title='یادآوری'
                open={reminderDialog.value}
                content={'تعدادی از کالاهای شما رد شده‌اند؛ شما می‌بایست آن‌ها را اصلاح یا حذف کنید.'}
                action={
                    <LoadingButton variant="contained" onClick={reminderDialog.onFalse} sx={{
                        borderRadius: '50px',
                        px: 2
                    }}>
                        متوجه شدم
                    </LoadingButton>
                }
            /> */}

            <DialogContent>
                <Box sx={{ p: 3, bgcolor: 'white', borderRadius: '16px' }}>
                    <Typography variant="h4" sx={{ width: 1, pb: 2, fontFamily: 'peyda-bold', borderBottom: '1px solid #D1D1D1' }}>
                        جزییات رد ‌سفارش
                    </Typography>
                    <Box>
                        <BlueNotification sx={{ my: 3 }}>
                            برای ثبت تغییرات کالاهای ناموجود،یکی از گزینه‌های «اصلاح سفارش»  یا «حذف کالاهای ردشده»  را انتخاب و سپس بر روی دکمه ثبت و ادامه کلیک کنید.
                        </BlueNotification>
                        <YellowNotification title="لیست کالاهای «سفارشی» دارای اصلاح" sx={{ my: 3 }}>
                            ادمین فروش اصلاحاتی برای این کالا ثبت کرده است. می‌توانید کالای مورد نظر را «اصلاح سفارش» یا «حذف کالاهای ردشده» کنید. در صورت اصلاح،  کالاهای مورد نظر بعد از اعمال اصلاحات و بررسی توسط ادمین، وضعیت‌شان در قسمت سبد خرید در بخش پروفایل، قابل مشاهده و پیگیری هستند.
                        </YellowNotification>
                    </Box>

                    <ShoppingCartList
                        type="edit"
                        items={orderProducts.map((op) => {
                            return {
                                ...op.product,
                                // coverUrl: endpoints.image.url(op.product.images.find((item) => item.main)?.name || ''),
                                need_to_assemble: op.need_to_assemble,
                                order_form_id: op.product.order_form_options.id,
                                subTotal: 0,
                                properties: op.properties.map((property) => {
                                    return {
                                        ...property,
                                        id: property.id,
                                        status: property.status,
                                        dimension: property.dimension,
                                        quantity: property.quantity,
                                        coating_type: property.coating_type,
                                        cover_type: property.cover_type,
                                        profile_type: property.profile_type,
                                        frame_type: property.frame_type,
                                    }
                                }),
                            }
                        })}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Stack direction={'row'} spacing={1} justifyContent={'end'}>
                    <StyledRoundedWhiteButton variant='outlined' sx={{ px: 4 }} onClick={dialog.onFalse}>انصراف</StyledRoundedWhiteButton>
                    <LoadingButton variant='contained' sx={{ borderRadius: '24px', px: 4 }} onClick={() => handleUpdateOrder()}>
                        ثبت نهایی اصلاحات
                    </LoadingButton>
                </Stack>
            </DialogActions>
        </React.Fragment>
    )
}