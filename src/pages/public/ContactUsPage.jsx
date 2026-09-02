import {
  Paper,
  Typography,
} from "@mui/material";

import PublicLayout from "../../components/public/PublicLayout";

export default function ContactUsPage() {
  return (
    <PublicLayout title="Contact Us">

      <Paper
        sx={{
          p:4,
          borderRadius:3,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Encryption Web
        </Typography>

        <Typography mt={2}>
          Secure Administration Portal
        </Typography>

        <Typography mt={4}>
          Contact your system administrator for support.
        </Typography>

      </Paper>

    </PublicLayout>
  );
}
