import {
    Button,
    Card,
    CardContent,
    IconButton,
    Stack,
    TableBody,
    Typography
} from '@mui/material';
import { Box } from '@mui/system';
import { RHFRadioGroup, RHFRadioGroupWithImage } from 'src/components/hook-form';
import Table from '@mui/material/Table';
import Scrollbar from 'src/components/scrollbar';
import CartTableRow from '../cart-table-row';
import { TableHeadCustom } from 'src/components/table';
import RHFTitleTextField from 'src/components/hook-form/rhf-title-text-field';
import { CoatingType, EAlgorithm, IProductDefaultDetails } from 'src/types/product';
import { endpoints } from 'src/utils/axios';
import { useEffect, useState } from 'react';
import IncrementerButton from 'src/sections/product/common/incrementer-button';
import { ICheckoutItemPropertyPrice } from 'src/types/checkout';
import Joyride, { TooltipRenderProps } from 'react-joyride';
import Iconify from 'src/components/iconify';
import { SecondaryButton } from 'src/components/styles/buttons/secondary';
import { IOrderProductPropertyStatus } from 'src/types/order-products-property';
import Image from 'src/components/image';
import { useShowOneTime } from 'src/hooks/use-show-one-time';
import { PrimaryButton } from '../../../components/styles/buttons/primary';
import { toFarsiNumber } from '../../../utils/change-case';
import { ECoatingTexture, ECoverEdgeTape } from 'src/types/cart';

export function getHeadLabel(algorithm: EAlgorithm) {
    const defult = [
        { id: 'dimension', label: 'ابعاد', width: 110 },
        { id: 'quntity', label: 'تعداد', width: 110 },
        { id: 'zzz', width: 88 },
    ]
    switch (algorithm) {
        case EAlgorithm.cabinet_door:
            return [
                { id: 'name', label: 'نوع پروفیل', width: 160 },
                { id: 'createdAt', label: 'پوشش نهایی', width: 160 },
                { id: 'inventoryType', label: 'نوع قاب', width: 160 },
                { id: 'price', label: 'روکش گیری', width: 140 },
                ...defult
            ];
        case EAlgorithm.cover_sheet:
            return [
                { id: "cover_type", label: "نوار لبه روکش" },
                { id: "inlaid_flower", label: "بافت روکش" },
                ...defult
            ];
        case EAlgorithm.cabinet_cloumn:
            return [
                { id: 'createdAt', label: 'پوشش نهایی', width: 160 },
                { id: "inlaid_flower", label: "گل منبت" },
                { id: "inlaid_flower_emty_space", label: "زمینه خالی جهت منبت" },
                ...defult
            ];
        case EAlgorithm.room_door:
            return [
                { id: "cover_type", label: "نوار لبه روکش" },
                { id: "inlaid_flower", label: "بافت روکش" },
                ...defult
            ];
        case EAlgorithm.shutter_door:
            return [
                { id: "cover_type", label: "نوار لبه روکش" },
                { id: "inlaid_flower", label: "بافت روکش" },
                ...defult
            ];
    }
}

export const CartTableHead = [
    { id: 'name', label: 'نوع پروفیل', width: 160 },
    { id: 'createdAt', label: 'پوشش نهایی', width: 160 },
    { id: 'inventoryType', label: 'نوع قاب', width: 160 },
    { id: 'price', label: 'روکش گیری', width: 140 },
    { id: 'publish', label: 'ابعاد', width: 110 },
    { id: 'quntity', label: 'تعداد', width: 110 },
    { id: 'zzz', width: 88 },
]

export const ReadyProductCartTableHead = [
    { id: 'name', label: 'نوع پوشش' },
    { id: 'publish', label: 'ابعاد', width: 110 },
    { id: 'quntity', label: 'تعداد', width: 110 },
    { id: 'zzz', width: 88 },
]

interface Props {
    listIndex: number | null
    formOptions: IProductDefaultDetails
    data: ICheckoutItemPropertyPrice[]
    algorithm: EAlgorithm;
    type?: 'cart' | 'edit' | 'view';
    onUpdate: (id: number) => void
    onDelete: (propertyId: number) => void
    setValue: (name: string, value: any) => void
    infoDialog: boolean
    values: any
}


const steps = [
    {
        target: '.my-first-step',
        title: 'وضعیت ردشده',
        content: 'کالاهایی که وضعیت رد‌شده دارند، توسط ادمین تایید نشده‌اند.',
        disableBeacon: true,
    },
    {
        target: '.reason',
        title: 'مشاهده علت',
        content: 'توضیحات ادمین برای دلایل رد محصول از طریق این دکمه نمایش داده می‌شود.',
        disableBeacon: true,
    },
    {
        target: '.edit',
        title: 'ویرایش محصول',
        content: 'با کلیک بر روی این آیکون،می‌توانید سفارش خود را ویرایش و جهت بررسی دوباره، برای ادمین ارسال کنید.',
        disableBeacon: true,
    },
    {
        target: '.del',
        title: 'حذف محصول',
        content: 'در صورتی که مایل باشید میتوانید محصول رد شده را از سبد خرید حذف کنید.',
        disableBeacon: true,
    },
]

const Tooltip = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps,
}: TooltipRenderProps) => (
    <Card sx={{ p: 2.5, direction: 'rtl', borderRadius: '24px', minWidth: 320, maxWidth: 320 }} {...tooltipProps}>
        <Stack direction={'row-reverse'} justifyContent={'space-between'} borderBottom={'1px solid #D1D1D1'} pb={2}>
            {step.title && <Typography mt={1} variant={'title2'}>{step.title}</Typography>}
            <Stack direction={'row'} alignItems={'center'}>
                <IconButton  {...primaryProps}>
                    <Iconify id="next" icon={'icon-park-outline:left'} />
                </IconButton>
                <Stack direction={'row'} mt={1} spacing={1}>
                    <Typography>{toFarsiNumber(index + 1)}</Typography>
                    <Box>/</Box>
                    <Typography border={'1px solid #D1D1D1'} borderRadius={'8px'} px={0.5}>
                        {toFarsiNumber(steps.length)}
                    </Typography>
                </Stack>
                <IconButton {...backProps}>
                    <Iconify id="back" icon={'icon-park-outline:right'} />
                </IconButton>
            </Stack>
        </Stack>
        <CardContent sx={{ direction: 'ltr', textAlign: 'left', px: 0, typography: 'body4' }}>{step.content}</CardContent>
        <Box sx={{ direction: 'rtl' }}>
            {(steps.length === (index + 1)) ? (
                <>
                    <PrimaryButton size={'small'} sx={{ ml: 1, height: '36px' }} {...closeProps}>
                        <Box id="close">متوجه شدم</Box>
                    </PrimaryButton>
                    <SecondaryButton size={'small'} sx={{ height: '36px' }} {...backProps}>
                        <Box id="back">مرحله قبل</Box>
                    </SecondaryButton>
                </>
            ) : (
                <>
                    <SecondaryButton size={'small'} sx={{ mt: 0, ml: 1, fontFamily: 'peyda-bold' }} {...primaryProps}>
                        <Box id="next">مرحله بعد</Box>
                    </SecondaryButton>
                    <Button color={"inherit"} sx={{ mt: 0, fontFamily: 'peyda-bold' }} {...closeProps}>
                        <Box id="close">بستن راهنما</Box>
                    </Button>
                </>
            )}
        </Box>
    </Card>
);

export default function CartDialogView({
    formOptions,
    data,
    listIndex,
    type,
    algorithm,
    onUpdate,
    onDelete,
    setValue,
    infoDialog,
    values,
}: Props) {
    const [ind, setInd] = useState<number | undefined>();
    const { show, update } = useShowOneTime("spot-light");
    const [maxHeight, setMaxHeight] = useState(400);

    useEffect(() => {
        const updateMaxHeight = () => {
            const dialogContent = document.querySelector('.MuiDialogContent-root');
            if (dialogContent) {
                setMaxHeight(dialogContent.clientHeight);
            }
        };

        updateMaxHeight();
        window.addEventListener('resize', updateMaxHeight);

        return () => {
            window.removeEventListener('resize', updateMaxHeight);
        };
    }, []);

    const [disable, setDisable] = useState({
        profile_type: true,
        cover_type: true,
        frame_type: true,
        coating_type: true,
        inlaid_flower: true,
        dimension: true
    });

    const [state, setState] = useState({
        run: false,
        loading: false,
        stepIndex: 0,
        modalOpen: false,
    });

    useEffect(() => {
        setInd(data.findIndex((d) => d.status === IOrderProductPropertyStatus.denied))
    }, []);

    useEffect(() => {
        if (!infoDialog && !show)
            setTimeout(() => setState({ ...state, run: true }), 1000 / 2);
        else
            setTimeout(() => setState({ ...state, run: false }), 1000 / 2);
    }, [infoDialog])

    useEffect(() => {
        let newDisable = { ...disable };

        switch (algorithm) {
            case EAlgorithm.cabinet_door:
                const findCover = formOptions.cover_type.find((p: any) => p.id == values.cover_type);
                const findFrame = formOptions.frame_type.find((p: any) => p.id == values.frame_type);

                if (values.profile_type)
                    newDisable.cover_type = false
                else
                    newDisable.profile_type = true

                if (values.cover_type)
                    newDisable.frame_type = false

                if (values.frame_type && !findFrame?.is_glass && !findCover?.is_raw)
                    newDisable.coating_type = false

                if (values.coating_type)
                    newDisable.dimension = false

                break;
            case EAlgorithm.cabinet_cloumn:

                if (values.cover_type)
                    newDisable.inlaid_flower = false
                else
                    newDisable.cover_type = false

                if (values.cover_type)
                    newDisable.dimension = false

                break;
            case EAlgorithm.cover_sheet:
                if (values.coating_texture)
                    newDisable.dimension = false
        }

        setDisable(newDisable);
    }, [values, formOptions]);

    useEffect(() => {
        if (listIndex || listIndex === 0) {
            setDisable({
                profile_type: false,
                cover_type: false,
                frame_type: false,
                coating_type: false,
                inlaid_flower: false,
                dimension: false
            })
        }
        // else {
        //     setDisable({
        //         profile_type: false,
        //         cover_type: true,
        //         frame_type: true,
        //         coating_type: true,
        //         inlaid_flower: true,
        //         dimension: true
        //     })
        // }
    }, [listIndex])

    useEffect(() => {
        if (algorithm !== EAlgorithm.cabinet_door) return;

        const findCover = formOptions.cover_type.find((p: any) => p.id == values.cover_type);
        const findFrame = formOptions.frame_type.find((p: any) => p.id == values.frame_type);

        if (findFrame?.is_glass || findCover?.is_raw) {
            setDisable({
                ...disable,
                coating_type: true
            })
            setValue('coating_type', CoatingType.emty)
        }

    }, [values.frame_type, values.cover_type])

    const handleJoyrideCallback = (data: any) => {
        const { action } = data;

        if (action === "close") {
            update("1")
            setState({ ...state, run: false })
        }
    };



    return (
        <Box sx={{ px: '40px' }}>
            {(!show) && (
                <Joyride
                    callback={handleJoyrideCallback}
                    tooltipComponent={Tooltip}
                    steps={steps}
                    run={state.run}
                    // disableScrolling
                    continuous
                    scrollToFirstStep
                    disableOverlayClose
                    // showProgress
                    showSkipButton
                    styles={{
                        overlay: {
                            height: '100%',
                            position: 'fixed',
                        },
                        options: {
                            zIndex: 10000,
                        },
                        spotlight: {
                            borderRadius: 100
                        }
                    }}
                    floaterProps={{
                        autoOpen: state.run,
                        hideArrow: true,
                    }}
                />
            )}

            <Stack direction={'row'} spacing={'24px'}>
                <Scrollbar
                    sx={{
                        width: '400px',
                        maxHeight,
                    }}
                >
                    <Box>
                        <Typography sx={{ py: '12px' }} variant='title2' color={'#727272'} display={'block'}>
                            ویژگی های مورد نظر را انتخاب کنید
                        </Typography>

                        {(formOptions.profile_type?.length > 0) && (
                            <Box width={1} pb={'24px'} sx={{ borderBottom: '1px solid #D1D1D1' }}>
                                <Typography variant="title3" fontFamily={'peyda-bold'} sx={{ width: 1, pb: '16px' }}>
                                    نوع پروفیل
                                </Typography>

                                <RHFRadioGroup
                                    name='profile_type'
                                    row
                                    sx={{
                                        width: 1,
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: 'repeat(1, 1fr)',
                                            md: 'repeat(2, 1fr)',
                                        },
                                    }}
                                    FormControlSx={{
                                        width: 1
                                    }}
                                    options={formOptions.profile_type.map((profile_type) => {
                                        return {
                                            label: profile_type.name,
                                            value: profile_type.id,
                                        }
                                    })}
                                />
                            </Box>
                        )}
                    </Box>

                    {formOptions.cover_type?.length > 0 && (
                        <Box sx={{ py: '24px', borderBottom: '1px solid #D1D1D1' }}>
                            <Typography
                                variant="title3"
                                fontFamily={'peyda-bold'}
                                sx={{
                                    width: 1,
                                    pb: '16px'
                                }}
                            >
                                پوشش نهایی
                            </Typography>
                            <RHFRadioGroupWithImage
                                name='cover_type'
                                disabled={disable.cover_type}
                                sx={{
                                    width: 1,
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'repeat(1, 1fr)',
                                        md: 'repeat(2, 1fr)',
                                    },
                                }}
                                FSx={{
                                    '&.MuiFormControlLabel-root': {
                                        mr: 0
                                    }
                                }}
                                options={formOptions.cover_type.map((cover_type) => {
                                    return {
                                        label: cover_type.name,
                                        value: cover_type.id,
                                        src: endpoints.cover_type.get_image(cover_type.icon_image_name)
                                    }
                                })}
                            />
                        </Box>
                    )}

                    {(formOptions.frame_type?.length > 0) && (
                        <Box sx={{ py: "24px", borderBottom: '1px solid #D1D1D1' }}>
                            <Typography variant="title3" fontFamily={'peyda-bold'} sx={{
                                width: 1, pb: '16px'
                            }}>
                                نوع قاب
                            </Typography>
                            <RHFRadioGroup
                                name='frame_type'
                                disabled={disable.frame_type}
                                row
                                sx={{
                                    width: 1,
                                    display: 'grid',
                                    rowGap: 1,
                                    gridTemplateColumns: {
                                        xs: 'repeat(1, 1fr)',
                                        md: 'repeat(2, 1fr)',
                                    },
                                }}
                                FormControlSx={{
                                    width: 1
                                }}
                                options={formOptions.frame_type.map((frame_type) => {
                                    return {
                                        label: frame_type.name,
                                        value: frame_type.id,
                                    }
                                })}
                            />
                        </Box>
                    )}

                    {(formOptions.coating_type) && (
                        <Box sx={{ py: "24px", borderBottom: '1px solid #D1D1D1' }}>
                            <Typography variant="title3" fontFamily={'peyda-bold'} sx={{
                                width: 1, pb: '16px'
                            }}>
                                نوع روکش گیری
                            </Typography>
                            <RHFRadioGroup
                                name='coating_type'
                                row
                                disabled={disable.coating_type}
                                sx={{
                                    width: 1,
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'repeat(1, 1fr)',
                                        md: 'repeat(2, 1fr)',
                                    },
                                }}
                                FormControlSx={{
                                    width: 1
                                }}
                                helperText={'روکش‌گیری جناقی به صورت هشتی انجام می‌شود.'}
                                options={[
                                    {
                                        label: 'جناقی',
                                        value: 'جناقی'
                                    },
                                    {
                                        label: 'غیر جناقی',
                                        value: 'غیر جناقی'
                                    }
                                ]}
                            />
                        </Box>
                    )}

                    {(algorithm === EAlgorithm.cover_sheet) && (
                        <Box sx={{ py: "24px", borderBottom: '1px solid #D1D1D1' }}>
                            <Typography variant="title3" fontFamily={'peyda-bold'} sx={{
                                width: 1, pb: '16px'
                            }}>
                                نوار لبه روکش:
                            </Typography>
                            <RHFRadioGroup
                                name='cover_edge_tape'
                                row
                                // disabled={disable.inlaid_flower}
                                sx={{
                                    width: 1,
                                    display: 'grid',
                                    rowGap: 1,
                                    gridTemplateColumns: {
                                        xs: 'repeat(1, 1fr)',
                                        md: 'repeat(2, 1fr)',
                                    },
                                }}
                                FormControlSx={{
                                    width: 1
                                }}
                                options={[
                                    {
                                        label: 'ندارد',
                                        value: ECoverEdgeTape.does_not_have
                                    },
                                    {
                                        label: '1 طول و 1 عرض',
                                        value: ECoverEdgeTape.length_width
                                    },
                                    {
                                        label: '4 طرف',
                                        value: ECoverEdgeTape.sides
                                    },
                                ]}
                            />
                        </Box>
                    )}

                    {(algorithm === EAlgorithm.cover_sheet) && (
                        <Box sx={{ py: "24px", borderBottom: '1px solid #D1D1D1' }}>
                            <Typography variant="title3" fontFamily={'peyda-bold'} sx={{
                                width: 1, pb: '16px'
                            }}>
                                نوع بافت روکش:
                            </Typography>
                            <RHFRadioGroup
                                name='coating_texture'
                                row
                                // disabled={disable.inlaid_flower}
                                sx={{
                                    width: 1,
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'repeat(1, 1fr)',
                                        md: 'repeat(2, 1fr)',
                                    },
                                }}
                                FormControlSx={{
                                    width: 1
                                }}
                                options={[
                                    {
                                        label: 'بلوط رگه راست',
                                        value: ECoatingTexture.right_vein
                                    },
                                    {
                                        label: 'بلوط موج دار',
                                        value: ECoatingTexture.wavy
                                    },
                                ]}
                            />
                        </Box>
                    )}

                    {(formOptions.inlaid_flower) && (
                        <Box sx={{ py: "24px", borderBottom: '1px solid #D1D1D1' }}>
                            <Typography variant="title3" fontFamily={'peyda-bold'} sx={{
                                width: 1, pb: '16px'
                            }}>
                                گل منبت
                            </Typography>
                            <RHFRadioGroup
                                name='inlaid_flower'
                                row
                                disabled={disable.inlaid_flower}
                                sx={{
                                    width: 1,
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'repeat(1, 1fr)',
                                        md: 'repeat(2, 1fr)',
                                    },
                                }}
                                FormControlSx={{
                                    width: 1
                                }}
                                options={[
                                    {
                                        label: 'دارد',
                                        value: true
                                    },
                                    {
                                        label: 'ندارد',
                                        value: false
                                    }
                                ]}
                            />
                        </Box>
                    )}


                    {(values.inlaid_flower === false || values.inlaid_flower === "0") && (
                        <Box sx={{ py: "24px", borderBottom: '1px solid #D1D1D1' }}>
                            <RHFTitleTextField name='inlaid_flower_emty_space' custom_label='زمینه خالی جهت منبت (سانتی متر)' placeholder='26' />
                        </Box>
                    )}

                    <Box sx={{ py: "24px" }}>
                        <Typography
                            variant="title3"
                            fontFamily={'peyda-bold'}
                            sx={{
                                width: 1, pb: '16px'
                            }}
                        >
                            ابعاد
                        </Typography>
                        <Stack direction={'row'}
                            spacing={2}
                            columnGap={2}
                            rowGap={3}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                md: 'repeat(2, 1fr)',
                            }}>
                            <RHFTitleTextField name='dimension.width' disabled={disable.dimension} custom_label='عرض (سانتی‌متر)' placeholder='26' />
                            <RHFTitleTextField name='dimension.length' disabled={disable.dimension} custom_label='طول - راه روکش (سانتی‌متر) ' placeholder='84' />
                        </Stack>
                        <Typography variant="body3" fontFamily={'peyda-bold'} sx={{
                            width: 1, pb: '8px', pt: '24px'
                        }}>
                            تعداد
                        </Typography>
                        <IncrementerButton
                            name="quantity"
                            disabled={disable.dimension}
                            onDecrease={() => setValue('quantity', values.quantity ? values.quantity + 1 : 1)}
                            onIncrease={() => {
                                if (values.quantity != 1)
                                    setValue('quantity', values.quantity ? values.quantity - 1 : 1)
                            }}
                        />
                    </Box>
                </Scrollbar>
                <Scrollbar sx={{ maxHeight }}>
                    {data.length ? (
                        <Table size={'medium'}>
                            <TableHeadCustom
                                sx={{
                                    backgroundColor: '#F2F2F2'
                                }}
                                cellSx={{ fontFamily: 'peyda-medium!important' }}
                                headLabel={getHeadLabel(algorithm)}
                            />
                            <TableBody>
                                {data.map((item, index: number) => (
                                    <CartTableRow
                                        key={index}
                                        index={index}
                                        indexEqual={ind}
                                        onDeleteRow={() => onDelete(item.id || index)}
                                        onEditRow={() => onUpdate(index)}
                                        selected={(listIndex === index)}
                                        type={type}
                                        row={{
                                            ...item,
                                            status: item.status,
                                            quality: item.quantity,
                                            coating: item?.coating_type,
                                            dimensions: item.dimension ? item.dimension.length + 'x' + item.dimension.width : '0x0',
                                            final_coating: item.cover_type?.name,
                                            frame_type: item.frame_type?.name,
                                            profile_type: item.profile_type?.name,
                                        }}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <Box sx={{ width: 1, textAlign: 'center', my: 14 }}>
                            <Image src='/assets/images/cart/Empty State.png' />
                        </Box>
                    )}
                </Scrollbar>
            </Stack>

        </Box>
    );
}
