import { LoadingButton } from "@mui/lab";
import { DialogActions } from "@mui/material";
import { StyledRoundedWhiteButton } from "src/components/styles/props/rounded-white-button";
import CompleteOrderLayout from "./layout/complete-order-layout";

type Props = {
    onCancel?: () => void
    onSubmit?: () => void
    title?: string
}

export function Actions({ onCancel, onSubmit, title = 'ثبت و ادامه' }: Props) {
    return (
        <DialogActions sx={{ px: 0 }}>
            <CompleteOrderLayout>
                <StyledRoundedWhiteButton variant='outlined' sx={{ px: 4, mr: 2 }}
                    onClick={onCancel}
                >
                    انصراف
                </StyledRoundedWhiteButton>
                <LoadingButton
                    variant='contained'
                    sx={{ borderRadius: '24px', px: 4 }}
                    type="submit"
                    onClick={onSubmit}
                >
                    {title}
                </LoadingButton>
            </CompleteOrderLayout>
        </DialogActions>
    )
}