import { Link, Stack } from "@mui/material";
import { IProductItem } from "src/types/product";
import Image from 'src/components/image';
import { Box, Button, Divider, Grid, IconButton, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useState } from "react";
import { varFade, varScale, MotionContainer, MotionViewport, varZoom } from 'src/components/animate';
import { m } from 'framer-motion';
import TiltCard from "src/components/animation/tilt-card";
import SvgColor from "src/components/svg-color";

type Props = {
    product?: IProductItem;
    ind: number
};

export default function ProductItemSlider({ product, ind }: Props) {
    const [img, setImg] = useState('/img/product/product.png')
    const [hover, setHover] = useState(false)

    const onHoverHandler = () => {
        setImg('/img/product/product-hover.png')
        setHover(true)
    }

    const onHoverOutHandler = () => {
        setImg('/img/product/product.png')
        setHover(false)
    }

    // console.log(ind)

    const Img = () => {
        return (
            <Image
                sx={{
                    opacity: (hover) ? 0 : 1,
                    transition: '0.6s ease-in!important',
                    '&:hover': {
                        opacity: 1,
                        transition: '0.6s ease-out!important',
                    }
                }}
                src={img}
                ratio="1/1"
                border={'1px solid #E0E0E0'}
                borderRadius={'8px'}
                onMouseOver={onHoverHandler}
                onMouseOut={onHoverOutHandler}
            />
        )
    }

    return (
        <Link href="/product/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2/" color={'inherit'} underline="none" key={ind}>
            <TiltCard>
                <Box sx={{
                    transform: !hover ? 'scale(0.98)' : 'scale(1)',
                    transition: '0.3s ease-in-out'
                }}
                >
                    <Stack sx={{ textAlign: 'left', alignItems: 'end' }} spacing={1}>
                        {hover ? <Img /> : <Img />}

                        <Typography variant='h5' sx={{
                            mt: 1, '&:hover': {
                                cursor: 'pointer'
                            }
                        }}>
                            درب ضد سرقت
                        </Typography>
                        <Stack direction={'row'}>
                            <Typography sx={{ pt: 0.5, pl: 1, fontSize: '16px' }} fontFamily={'peyda-regular'}>کد 65</Typography>
                            <IconButton size='small' sx={{ bgcolor: "#D1D1D1" }}>
                                {/* <Iconify icon="icon-park-solid:like" /> */}
                                <SvgColor src="/assets/icons/product/save-icon-products.svg" color={"#fff"} sx={{ width: 20, height: 20 }} />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Box>
            </TiltCard>
        </Link>
    )
}