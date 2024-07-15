import { useRef, useState, useEffect, useCallback, use } from 'react';
import * as Yup from 'yup';

import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';

import { useBoolean, useBooleanReturnType } from 'src/hooks/use-boolean';
import { Stack, TableBody, Typography } from '@mui/material';
import { Box, height } from '@mui/system';
import RHFTitleTextField from '../hook-form/rhf-title-text-field';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form';
import { CartDialogView } from 'src/sections/cart/view';
import { LoadingButton } from '@mui/lab';
import { StyledRoundedWhiteButton } from '../styles/props/rounded-white-button';
import { useGetOrderForm } from 'src/api/order-form';
import { ICheckoutAddCustomMadeProductData, ICheckoutItemPropertyPrice } from 'src/types/checkout';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'src/components/snackbar';
import { IOrderProductPropertyStatus } from 'src/types/order-products-property';
import { endpoints, server_axios } from 'src/utils/axios';

// ----------------------------------------------------------------------
interface Props {
    dialog: useBooleanReturnType;
    order_form_id: number;
    product_name: string;
    currentData?: ICheckoutItemPropertyPrice | undefined;
    listId?: number | undefined;
    listData?: ICheckoutItemPropertyPrice[] | undefined
    onAddCart: (data: ICheckoutItemPropertyPrice[]) => void;
    onDelete?: (propertyId: number) => void;
    handleUpdateRow?: (data: ICheckoutItemPropertyPrice[]) => void;
}

export default function CartDialog({
    dialog,
    order_form_id,
    product_name,
    currentData,
    listId,
    listData,
    onAddCart,
    onDelete,
    handleUpdateRow
}: Props) {
    const [list, setList] = useState<ICheckoutItemPropertyPrice[]>([]);
    const [id, setId] = useState<null | number>(null);
    const { form, formLoading } = useGetOrderForm(order_form_id);

    const { enqueueSnackbar } = useSnackbar();

    const NewProductSchema = Yup.object().shape({
        profile_type: Yup.number().required('نوع پروفایل الزامی است'),
        // profile_type: Yup.object().shape({
        //     id: Yup.number(),
        //     name: Yup.string(),
        // }),
        cover_type: Yup.number().required('نوع پوشش الزامی است'),
        frame_type: Yup.number().required('نوع قاب الزامی است'),
        quantity: Yup.number().required('تعداد الزامی است').typeError('تعداد باید عدد باشد'),
        dimension: Yup.object().shape({
            width: Yup.number().required('عرض الزامی است').typeError('عرض باید عدد باشد'),
            height: Yup.number().required('ارتفاع الزامی است').typeError('ارتفاع باید عدد باشد'),
        })
    });

    const defaultValues: any = {
        quantity: 1,
        dimension: {
            width: 0,
            height: 0,
        },
        profile_type: 0,
        cover_type: 0,
        frame_type: 0,
        coating_type: 'جناقی'
    };

    if (currentData?.id) defaultValues.id = currentData.id;

    const methods = useForm({
        resolver: yupResolver(NewProductSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (data: any) => {
        try {
            const custom = { ...data }
            if (form.profile_type) custom.profile_type = form.profile_type.find((item) => item.id === data.profile_type);
            if (form.cover_type) custom.cover_type = form.cover_type.find((item) => item.id === data.cover_type);
            if (form.frame_type) custom.frame_type = form.frame_type.find((item) => item.id === data.frame_type);

            if (id === null) {
                setList([
                    ...list,
                    {
                        ...custom
                    }
                ]);
                console.log("data was updated")
            } else {
                list[id] = custom;
                if (handleUpdateRow) list[id].status = IOrderProductPropertyStatus.edited;
                setList([...list]);

                if (handleUpdateRow) server_axios.patch(endpoints.orderProductProperties.update(list[id].id), list[id])
                    .then(({ data }) => {
                        console.log(data)
                    })
                // setId(null); // felan khali bashe
            }
        } catch (error) {
            console.error(error);
        }
    });

    const customizeData = useCallback((item: ICheckoutItemPropertyPrice) => {
        return {
            ...item,
            cover_type: item.cover_type.id,
            profile_type: item.profile_type.id,
            frame_type: item.frame_type.id,
            dimension: {
                width: item.dimension?.width || 0,
                height: item.dimension?.height || 0,
            }
        }
    }, [form])

    useEffect(() => {
        if (listId === undefined || listId === null) return;
        setId(listId)
    }, [listId])

    useEffect(() => {
        if (id === null) {
            reset(defaultValues);
        }
    }, [id])

    useEffect(() => {
        if (id === null || !list.length) return;
        const item = list[id];
        reset(customizeData(item));
    }, [id, list])

    useEffect(() => {
        if (!currentData) return;
        reset(customizeData(currentData));
    }, [currentData])

    useEffect(() => {
        console.log('listData updating...',)
        if (!listData?.length) {
            if (!listData?.length && id === null) return setList([]);
            return
        }
        setList(listData)
    }, [listData, id])

    const handleUpdate = useCallback((itemId: number) => {
        setId(itemId)
    }, [setId])

    const handleAddToList = useCallback(() => {
        if (!list.length) return enqueueSnackbar("لطفا لیست را پر کنید", {
            variant: 'error'
        })

        if (handleUpdateRow !== undefined)
            handleUpdateRow(list)
        else
            onAddCart(list)
    }, [list]);
      
    const onDeleteRow = (pIndex: number) => {
        // remove from list
        console.log(list[0])
        let newList = [...list];
        newList.splice(pIndex, 1);
        console.log(newList, pIndex)
        setList(newList)
    }

    return (
        <Dialog open={dialog.value} onClose={dialog.onFalse} scroll={'body'} fullWidth={true} maxWidth={'xl'}>
            <FormProvider methods={methods} onSubmit={onSubmit}>

                {(!formLoading) && (
                    <CartDialogView
                        title={product_name}
                        formOptions={form}
                        data={list}
                        listId={id}
                        onUpdate={handleUpdate}
                        onDelete={onDelete || onDeleteRow}
                    />
                )}

                <DialogContent sx={{ p: 4, backgroundColor: '#F8F8F8', overflow: 'hidden', width: 1 }}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Stack direction={'row'} spacing={2}>
                            {(id !== null && id >= 0) && (
                                <>
                                    <StyledRoundedWhiteButton
                                        variant='outlined'
                                        sx={{ borderRadius: '24px', px: 4 }}
                                        onClick={() => setId(null)}
                                    >
                                        انصراف
                                    </StyledRoundedWhiteButton>
                                    <LoadingButton
                                        variant='contained'
                                        sx={{ borderRadius: '24px', px: 4 }}
                                        type='submit'
                                    >
                                        اعمال تغییرات
                                    </LoadingButton>
                                </>
                            )}
                            {(listId === undefined && id === null && !listData?.length) && (
                                <StyledRoundedWhiteButton variant='outlined' type='submit' sx={{ px: 6, width: '400px' }}>
                                    افزودن به لیست
                                </StyledRoundedWhiteButton>
                            )}
                        </Stack>
                        <Stack direction={'row'} spacing={2}>
                            <StyledRoundedWhiteButton variant='outlined' sx={{ px: 2 }} onClick={() => {
                                dialog.onFalse();
                                setList([]);
                                setId(null);
                            }}>
                                انصراف
                            </StyledRoundedWhiteButton>
                            <LoadingButton
                                variant='contained'
                                sx={{ borderRadius: '24px', px: 4 }}
                                onClick={handleAddToList}
                            >
                                افزودن به سبد خرید
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </DialogContent>
            </FormProvider>
        </Dialog>
    );
}
