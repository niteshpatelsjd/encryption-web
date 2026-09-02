import {
  Paper,
  Typography,
} from "@mui/material";

export default function PublicSection({
  title,
  children,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        border: "1px solid #E5E7EB",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: "#475569",
          lineHeight: 1.9,
          whiteSpace: "pre-line",
        }}
      >
        {children}
      </Typography>
    </Paper>
  );
}