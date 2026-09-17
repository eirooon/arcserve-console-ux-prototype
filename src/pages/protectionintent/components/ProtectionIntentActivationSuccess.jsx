import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  Check,
  MailOutline,
  MonitorHeart,
  ShieldOutlined,
  Storage,
  Tag,
  TrackChanges,
} from "@mui/icons-material";
import { green, grey } from "@mui/material/colors";

const PROTECTION_STEPS = [
  { icon: <ShieldOutlined fontSize="small" />, label: "Applying protection policies" },
  { icon: <Storage fontSize="small" />, label: "Deploying backup jobs" },
  { icon: <MonitorHeart fontSize="small" />, label: "Enabling health monitoring" },
  { icon: <TrackChanges fontSize="small" />, label: "Starting daily discovery" },
];

export default function ProtectionIntentActivationSuccess({ onViewDashboard }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 64px)",
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 480, width: "100%", boxShadow: "0px 4px 20px rgba(0,0,0,0.1)" }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Avatar sx={{ bgcolor: green[50], color: green[700], width: 56, height: 56 }}>
              <Check fontSize="medium" />
            </Avatar>

            <Stack spacing={0.5}>
              <Typography variant="h4" fontWeight={700} color="text.primary">
                You&rsquo;re protected
              </Typography>
              <Typography variant="body1" color="text.secondary">
                31 sources are now under active protection.
              </Typography>
            </Stack>

            <List sx={{ width: "100%", py: 0 }}>
              {PROTECTION_STEPS.map(({ icon, label }) => (
                <ListItem key={label} disableGutters sx={{ py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    slotProps={{ primary: { variant: "body1", color: "text.primary" } }}
                  />
                </ListItem>
              ))}
            </List>

            <Paper elevation={0} sx={{ width: "100%", p: 2, bgcolor: grey[50], borderRadius: 2 }}>
              <Stack spacing={1.5} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Takes 5-15 minutes depending on infrastructure size.
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" justifyContent="center">
                  <MailOutline fontSize="inherit" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    erron.sevilla@arcserve.com
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
                    &middot;
                  </Typography>
                  <Tag fontSize="inherit" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    #arcgenie-daily
                  </Typography>
                </Stack>
              </Stack>
            </Paper>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={onViewDashboard}
            >
              .View Overview
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
