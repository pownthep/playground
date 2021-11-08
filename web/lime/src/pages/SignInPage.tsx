import React, { memo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import GoogleIcon from "@mui/icons-material/Google";
import { useRecoilState } from "recoil";
import { googleOAuthRefreshToken } from "@/store";
import { signIn } from "@web/react-web-sdk/api/google_drive";
import CircularProgress from "@mui/material/CircularProgress";

export default memo(function SignInPage() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [refreshToken, setRefreshToken] = useRecoilState(
    googleOAuthRefreshToken
  );
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    const res = await signIn();
    console.log(res);
    if (res.refreshToken) setRefreshToken(res.refreshToken);
    setLoading(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={true}
      aria-labelledby="google-sign-in-dialog-title"
    >
      <DialogTitle id="google-sign-in-dialog-title">
        Required: Google Account
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Most of the features required an access token from a Google account.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {loading ? (
          <CircularProgress size={24} thickness={6} />
        ) : (
          <Button
            onClick={handleClick}
            startIcon={<GoogleIcon />}
            variant="outlined"
          >
            Authenticate
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
});
