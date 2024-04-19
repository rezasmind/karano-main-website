'use client';

import { useScroll } from 'framer-motion';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import MainLayout from 'src/layouts/main';

import ScrollProgress from 'src/components/scroll-progress';

import Image from 'src/components/image';
import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import { _carouselsExample } from 'src/sections/_examples/extra/carousel-view';
import CarouselBasic3 from 'src/sections/_examples/extra/carousel-view/carousel-basic-3';
import CarouselBasic1 from 'src/sections/_examples/extra/carousel-view/carousel-basic-1';
import { HEADER } from 'src/layouts/config-layout';
import { useCallback, useEffect, useState } from 'react';
import CarouselHomeCategory from 'src/sections/_examples/extra/carousel-view/carousel-home-category';
import CustomPopover, { usePopover, MenuPopoverArrowValue } from 'src/components/custom-popover';
import CarouselBasic2 from 'src/sections/_examples/extra/carousel-view/carousel-basic-2';
import CarouselProducts from 'src/sections/_examples/extra/carousel-view/carousel-products';
import { varFade, MotionViewport } from 'src/components/animate';

import { m } from 'framer-motion';
import HomeOrderWithKarano from '../home-order-with-karano';
import CountUp from 'react-countup';
import { useResponsive } from 'src/hooks/use-responsive';
// ----------------------------------------------------------------------

export default function HomeView() {
  const mdUp = useResponsive('up', 'md');

  const { scrollY, scrollYProgress } = useScroll();

  const [percent, setPercent] = useState(0);

  const customizedPopover = usePopover();

  const getScroll = useCallback(() => {
    let heroHeight = 0;

    // if (heroRef.current) {
    //   heroHeight = heroRef.current.offsetHeight;
    // }

    scrollY.on('change', (scrollHeight) => {
      const scrollPercent = (scrollHeight * 100) / heroHeight;

      setPercent(Math.floor(scrollPercent));
    });
  }, [scrollY]);

  useEffect(() => {
    getScroll();
  }, [getScroll]);

  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      {/* <HomeHero /> */}

      <Box
        // maxWidth={'xl'}
        component={MotionViewport}
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
          // mt: `${HEADER.H_DESKTOP + 20}px`
        }}
      >

        <Box sx={{ width: 1, ml: 'auto' }}>
          <CarouselHomeCategory />

          <Stack spacing={12}>
            <CarouselBasic1 data={_carouselsExample.slice(0, 8)} sx={{ mt: 4 }} />

            <m.div
              initial={varFade().inDown.initial}
              whileInView={varFade().inDown.animate}
              exit={varFade().inUp.exit}
              viewport={{
                once: true,
                amount: 1
              }}
              transition={{
                duration: 1,
              }}
            >
              <Box sx={{
                backgroundImage: "url('/assets/images/landing/mmm.jpg')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                color: '#fff', textAlign: 'center'
              }}>
                <Typography sx={{ width: 1, color: "#fff", py: 5 }} variant='h3'>
                  کارانو، راه‌حل‌های کارامد در صنعت چوب
                </Typography>
                <Grid
                  container
                  sx={{ py: 6, fontFamily: 'peyda-bold', fontSize: '4rem' }}
                  spacing={!mdUp ? 6 : 0}
                >
                  {[...new Array(4)].map((_, index) => (
                    <Grid item md={3} sm={12} xs={12} key={index} borderRight={mdUp ? '1px solid #fff' : ''}>
                      <Box width={!mdUp ? 'fit-content' : 1} sx={{ mx: 'auto' }} borderBottom={!mdUp ? '1px solid #fff' : ''}>

                        <CountUp duration={3} end={99 * (index+1)} redraw={true} delay={1} /> +
                        <Typography fontFamily={'peyda-regular'} sx={{ pb: 3 }} variant='h5'>سال تجربه و قدمت</Typography>

                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Box>
                <Typography variant='h3' fontFamily={'peyda-bold'} sx={{ pb: 2 }}>ایده ها و محصولات قابل اجرا با کارانو</Typography>
                <Grid container spacing={2}>
                  <Grid sm={12} md={3} item>
                    <Image alt={'karano'} src={'/assets/images/landing/ideas/classic-01 12.jpg'} sx={{ width: 1, height: 1 }} />
                  </Grid>
                  <Grid sm={12} md={3} item>
                    <Stack spacing={2}>
                      <Image alt={'karano'} src={'/assets/images/landing/ideas/classic-01 15.jpg'} sx={{ width: 1, height: 0.7 }} />
                      <Image alt={'karano'} src={'/assets/images/landing/ideas/classic-01 14.jpg'} sx={{ width: 1, height: 0.3 }} />
                    </Stack>

                  </Grid>
                  <Grid sm={12} md={6} item>
                    <Box sx={{
                      width: 24,
                      height: 24,
                      position: 'absolute',
                      zIndex: 1,
                      // top: 0,
                      ml: '100px',
                      mt: '100px'
                    }}>
                      <Button variant="contained" onClick={customizedPopover.onOpen} sx={{ mr: 5 }}>
                        Open
                      </Button>
                      <CustomPopover
                        open={customizedPopover.open}
                        onClose={customizedPopover.onClose}
                        arrow={'bottom-center'}
                      >
                        <Box sx={{ p: 2, maxWidth: 280 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Etiam feugiat lorem non metus
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Fusce vulputate eleifend sapien. Curabitur at lacus ac velit ornare lobortis.
                          </Typography>
                        </Box>
                      </CustomPopover>
                    </Box>
                    <Image alt={'karano'} src={'/assets/images/landing/ideas/image 227.jpg'} sx={{ width: 1, height: 1 }} />
                  </Grid>
                </Grid>
              </Box>
            </m.div>


            <HomeOrderWithKarano />


            <CarouselProducts data={_carouselsExample.slice(0, 8)} />

            <Box>
              <Grid container spacing={5}>
                <Grid item md={5}>
                  <Typography variant='h3' fontFamily={'peyda-bold'} sx={{ pb: 2 }}>سفارش به سبک کارانو</Typography>
                  <Typography variant='h6' fontFamily={'peyda-medium'} sx={{ pb: 2 }}>
                    کارانو در سال ۱۳۹۶  فعالیت خود را در زمینه تولید محصولات چوبی آغاز نمود. این موسسه با اتکا بر توان اجرایی خود و بهره‌گیری از تجربه پیشگامان جهانی صنعت چوب، همواره به ارتقا سطح اجرا در صنعت ساختمان کشور یاری رسانده است.
                    هم اکنون کارانو، با عرضه قطعات پیش ساخته دکوراسیون داخلی، سال‌ها تجربه خود را در اختیار همکاران این صنعت قرار داده است.
                    صنایع چوبی چنوب و گروه صنعتی تهران فرم، نام‌های تجاری سابق کارانو می‌باشد.
                  </Typography>
                </Grid>
                <Grid item md={7}>
                  <Image alt={'karano'} src={'/assets/images/landing/Screen Shot 1401-12-04 at 17.15.png'} sx={{ width: 1 }} />
                </Grid>
              </Grid>
            </Box>

          </Stack>
        </Box>



        {/* <HomeHugePackElements />

        <Box sx={{ position: 'relative' }}>
          <StyledPolygon />
          <HomeForDesigner />
          <StyledPolygon anchor="bottom" />
        </Box>

        <HomeDarkMode />

        <HomeColorPresets />

        <HomeCleanInterfaces />

        <HomePricing />

        <HomeLookingFor />

        <HomeAdvertisement /> */}
      </Box>
    </MainLayout>
  );
}
