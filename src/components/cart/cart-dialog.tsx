import { useRef, useState, useEffect, useCallback, use } from 'react';
import * as Yup from 'yup';

import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';

import { useBoolean, useBooleanReturnType } from 'src/hooks/use-boolean';
import { Stack, TableBody, Typography } from '@mui/material';
import { Box, height } from '@mui/system';
import RHFTitleTextField from '../hook-form/rhf-title-text-field';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
import Table from '@mui/material/Table';
import { TableHeadCustom } from '../table';
import CartTableRow from '../../sections/cart/cart-table-row';
import Scrollbar from '../scrollbar';
import { CartDialogView } from 'src/sections/cart/view';
import { LoadingButton } from '@mui/lab';
import { StyledRoundedWhiteButton } from '../styles/props/rounded-white-button';
import { useGetOrderForm } from 'src/api/order-form';
import { ICheckoutAddCustomMadeProductData } from 'src/types/checkout';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------
interface Props {
    dialog: useBooleanReturnType
    order_form_id: number
    product_name: string
    onAddCart: (data: ICheckoutAddCustomMadeProductData[]) => void;
}


export default function CartDialog({
    dialog,
    order_form_id,
    product_name,
    onAddCart
}: Props) {
    const [list, setList] = useState<ICheckoutAddCustomMadeProductData[]>([]);
    const [id, setId] = useState<null | number>(null);
    const { form } = useGetOrderForm(order_form_id);

    const NewProductSchema = Yup.object().shape({
        profile_type: Yup.string().required('نوع پروفایل الزامی است'),
        cover_type: Yup.string().required('نوع پوشش الزامی است'),
        frame_type: Yup.string().required('نوع قاب الزامی است'),
        quantity: Yup.number().required('تعداد الزامی است').typeError('تعداد باید عدد باشد'),
        dimention: Yup.object().shape({
            width: Yup.number().required('عرض الزامی است').typeError('عرض باید عدد باشد'),
            height: Yup.number().required('ارتفاع الزامی است').typeError('ارتفاع باید عدد باشد'),
        })
    });

    const defaultValues = {
        quantity: 1,
        dimention: {
            width: 0,
            height: 0,
        },
        profile_type: '',
        cover_type: '',
        frame_type: '',
        coating_type: 'جناقی'
    };

    const methods = useForm({
        resolver: yupResolver(NewProductSchema),
        defaultValues,
    });

    const { reset, watch, control, setValue, handleSubmit } = methods;

    const values = watch();

    const descriptionElementRef = useRef<HTMLElement>(null);

    const onSubmit = handleSubmit(async (data: any) => {
        try {
            if (id == null) {
                setList([
                    ...list,
                    {
                        ...data
                    }
                ]);
            } else {
                list[id] = data;
                setId(null);
            }


            // onAddCart({
            //     dimention: data.width + "*" + data.height,
            //     quantity: data.quantity,
            //     cover_type: data.cover_type,
            // })
        } catch (error) {
            console.error(error);
        }
    });

    // useEffect(() => {
    //     if (dialog.value) {
    //         const { current: descriptionElement } = descriptionElementRef;
    //         if (descriptionElement) {
    //             descriptionElement.focus();
    //         }
    //     }
    // }, [dialog.value]);

    // useEffect(() => {
    //     if (id === null) {
    //         console.log("--> reset form");
    //         reset({
    //             ...defaultValues,
    //             profile_type: (form.profile_type?.length) ? form.profile_type[0].name : '',
    //             cover_type: (form.cover_type?.length) ? form.cover_type[0].name : '',
    //             frame_type: (form.frame_type?.length) ? form.frame_type[0].name : '',
    //         })
    //     }
    // }, [form])

    useEffect(() => {
        if (id === null) return;
        console.log("--> update form", id);
        const item = list[id];
        console.log(item)
        reset(item);
    }, [id])

    const handleUpdate = useCallback((itemId: number) => {
        setId(itemId)
    }, [setId])

    return (
        <Dialog open={dialog.value} onClose={dialog.onFalse} scroll={'body'} fullWidth={true} maxWidth={'xl'}>
            <FormProvider methods={methods} onSubmit={onSubmit}>

                <CartDialogView
                    title={product_name}
                    formOptions={form}
                    data={list}
                    onUpdate={handleUpdate}
                />

                <DialogContent sx={{ p: 4, backgroundColor: '#F8F8F8', overflow: 'hidden', width: 1 }}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Box>
                            {/* <LoadingButton type='submit'>ss</LoadingButton> */}
                            <StyledRoundedWhiteButton variant='outlined' type='submit' sx={{ px: 6 }}>
                                {(id == null) ? 'افزودن به لیست' : 'ویرایش لیست'}
                            </StyledRoundedWhiteButton>
                        </Box>
                        <Stack direction={'row'} spacing={2}>
                            <StyledRoundedWhiteButton variant='outlined' sx={{ px: 2 }} onClick={() => {
                                dialog.onFalse()
                                setList([]);
                                setId(null);
                            }}>
                                انصراف
                            </StyledRoundedWhiteButton>
                            <LoadingButton
                                variant='contained'
                                sx={{ borderRadius: '24px', px: 4 }}
                                onClick={() => onAddCart(list)}
                            >
                                افزودن به لیست سبد
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </DialogContent>
            </FormProvider>
        </Dialog>
    );
}
