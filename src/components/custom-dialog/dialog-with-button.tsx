import React, { useRef, useEffect, forwardRef } from 'react';
import Dialog from '@mui/material/Dialog';

import { useBooleanReturnType } from 'src/hooks/use-boolean';
import { Button, Container, IconButton, Paper, Radio, Slide, Stack, Typography } from '@mui/material';
import { Box, maxWidth, SxProps } from '@mui/system';
import Scrollbar from '../scrollbar';
import SvgColor from '../svg-color';
import { StyledRoundedWhiteButton } from '../styles/props/rounded-white-button';
import { LoadingButton } from '@mui/lab';
import { TransitionProps } from 'notistack';

// ----------------------------------------------------------------------
interface Props {
    dialog: useBooleanReturnType,
    children: React.ReactNode,
    fullWith: boolean
    width?: number
    sx?: SxProps
}

const Transition = forwardRef(
    (
        props: TransitionProps & {
            children: React.ReactElement;
        },
        ref: React.Ref<unknown>
    ) => <Slide direction="up" ref={ref} {...props} />
);



export default function DialogWithButton({ dialog, children, fullWith, width = 480, sx }: Props) {

    const default_sx = fullWith ? {} : { maxWidth: `${width}px!important` }


    const descriptionElementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (dialog.value) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement) {
                descriptionElement.focus();
            }
        }
    }, [dialog.value]);

    const CustomPaperComponent = React.forwardRef<HTMLDivElement>((props, ref) => (
        <Box ref={ref}
            display="flex"
            // alignItems="center"
            justifyContent={'center'}
            {...props}
            sx={{
                position: 'fixed!important',
                // display: 'flex!important',
                // position: 'relative',
                // mx: 'auto',
                flexDirection: 'row!important',
                overflowY: 'unset!important',
                boxShadow: 'none!important'
                // verticalAlign: 'center'
            }}>
            <Paper {...props} sx={{ ...default_sx }} />
            <Box mt={2}>
                <IconButton
                    onClick={dialog.onFalse}
                    sx={{
                        bgcolor: 'white',
                        height: 'fit-content',
                        borderRadius: '50%',
                        border: '1px solid #D1D1D1',
                        '&:hover': { background: '#F2F2F2' },
                    }}
                >
                    <SvgColor src='/assets/icons/navbar/x-close.svg' />
                </IconButton>
            </Box>
        </Box>
    ));

    return (
        <Dialog
            open={dialog.value}
            PaperComponent={CustomPaperComponent}
            onClose={dialog.onFalse}
            // scroll={'body'}
            TransitionComponent={Transition}
            maxWidth={'lg'}
            PaperProps={{
                style: {
                    // backgroundColor: 'transparent',
                    // boxShadow: 'none',
                    // margin: 0,
                    // marginTop: 20,
                    // marginBottom: 20,
                    width: '100%',
                    // zIndex: 99
                    // maxWidth: 'calc(100% - 14px)',
                    // minHeight: '90vh',
                    // maxHeight: '90vh',
                },
            }}
            // fullWidth={fullWith}
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0,0,0,0.8)'
                }
            }}
        >
            {children}
            {/* <Container maxWidth={'lg'} sx={{ px: '8px!important' }}>
                <Box sx={{
                    display: 'flex',
                    mx: 'auto',
                    ...default_sx,
                    // ...sx
                }}>
                    <Scrollbar>
                        <Box sx={{ p: 2, bgcolor: 'white', borderRadius: '16px' }}>
                            {children}
                        </Box>
                    </Scrollbar>
                    <IconButton onClick={() => { dialog.onFalse() }} sx={{ bgcolor: 'white', height: 'fit-content', ml: 2, borderRadius: '50%', border: '1px solid #D1D1D1', '&:hover': { background: '#F2F2F2' } }}>
                        <SvgColor src='/assets/icons/navbar/x-close.svg' />
                    </IconButton>
                </Box>
            </Container> */}
            {/* <IconButton onClick={() => { dialog.onFalse() }} sx={{
                    position: 'fixed',
                    left: 0,
                    zIndex: 1000,
                    bgcolor: 'white',
                    height: 'fit-content',
                    ml: 2,
                    borderRadius: '50%',
                    border: '1px solid #D1D1D1',
                    '&:hover': { background: '#F2F2F2' }
                }}>
                    <SvgColor src='/assets/icons/navbar/x-close.svg' />
                </IconButton> */}
        </Dialog>
    );
}
