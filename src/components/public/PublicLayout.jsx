import { Box, Container, Typography } from "@mui/material";

export default function PublicLayout({
  title,
  children,
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
      }}
    >
      <Box
        sx={{
          bgcolor: "#1E3A8A",
          color: "#FFF",
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={800}
        >
          Encryption Web
        </Typography>

        <Typography
          sx={{
            mt: 1,
            opacity: 0.9,
          }}
        >
          Secure Administration Portal
        </Typography>
      </Box>

      <Container
        maxWidth="md"
        sx={{
          py: 5,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          mb={4}
        >
          {title}
        </Typography>

        {children}

        <Typography
          sx={{
            mt: 8,
            color: "#64748B",
            textAlign: "center",
          }}
        >
          © 2026 Encryption Web
        </Typography>
      </Container>
    </Box>
  );
}
