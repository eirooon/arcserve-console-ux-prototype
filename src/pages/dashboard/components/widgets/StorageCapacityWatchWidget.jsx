import React, { memo } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import {
  Box,
  Stack,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";

import CardWidget from "../../../../components/CardWidget";

function StorageMiniCard({
  title,
  usedText,
  totalText,
  asOfText,
  availableText,
  excessText,
  percent,
  barColor,
  icon,
}) {
  const isExcess = Boolean(excessText);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "#E2E8F0",
        borderRadius: 2,
        p: 2,
        width: "100%",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: "grey.100",
            display: "grid",
            placeItems: "center",
            flex: "0 0 auto",
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, lineHeight: 1.2 }}
        >
          {title}
        </Typography>
      </Stack>

      <Box sx={{ mt: 2 }}>
        <LinearProgress
          variant="determinate"
          value={Math.max(0, Math.min(100, percent || 0))}
          sx={{
            height: 12,
            borderRadius: 999,
            bgcolor: "grey.200",
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              bgcolor: barColor,
            },
          }}
        />
      </Box>

      <Typography variant="body2" sx={{ mt: 1.5, fontWeight: 800 }}>
        {usedText}
        <Box component="span" sx={{ fontWeight: 500, color: "text.secondary" }}>
          used from
        </Box>{" "}
        {totalText}{" "}
        <Box component="span" sx={{ fontWeight: 500, color: "text.secondary" }}>
          as of {asOfText}
        </Box>
      </Typography>

      {!isExcess && (
        <Typography
          variant="body2"
          sx={{ mt: 1, color: "text.secondary", lineHeight: "30px" }}
        >
          {availableText}
        </Typography>
      )}

      {isExcess && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <Typography
            variant="body2"
            sx={{ color: "error.main", fontWeight: 600, lineHeight: "30px" }}
          >
            {excessText}
          </Typography>
          <Tooltip title="You’ve exceeded the allocated storage for this destination/pool.">
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Box>
  );
}

StorageMiniCard.propTypes = {
  title: PropTypes.string.isRequired,
  usedText: PropTypes.string.isRequired,
  totalText: PropTypes.string.isRequired,
  asOfText: PropTypes.string.isRequired,
  availableText: PropTypes.string,
  excessText: PropTypes.string,
  percent: PropTypes.number,
  barColor: PropTypes.string,
  icon: PropTypes.node,
};

function UdpDataStoresRow({ valueText, ldsIcon }) {
  return (
    <Box
      sx={{
        mt: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Grid container spacing={1.5} alignItems="center" wrap="nowrap">
            <Grid item>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "grey.100",
                  display: "grid",
                  placeItems: "center",
                  flex: "0 0 auto",
                }}
              >
                {ldsIcon}
              </Box>
            </Grid>

            <Grid item>
              <Grid container spacing={2} alignItems="baseline" wrap="wrap">
                <Grid item>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    UDP Data Stores
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Protected Data
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {valueText}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

UdpDataStoresRow.propTypes = {
  valueText: PropTypes.string.isRequired,
};

function StorageCapacityWatchWidget({
  title,
  description,
  data,
  udpValueText,
  ldsIcon,
}) {
  return (
    <CardWidget title={title} description={description}>
      <Grid container spacing={2}>
        {data.map(({ key, ...cardProps }) => (
          <Grid key={key} size={{ xs: 12, sm: 12, md: 4 }}>
            <StorageMiniCard {...cardProps} />
          </Grid>
        ))}
      </Grid>

      <UdpDataStoresRow ldsIcon={ldsIcon} valueText={udpValueText} />
    </CardWidget>
  );
}

StorageCapacityWatchWidget.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  data: PropTypes.shape({
    cards: PropTypes.arrayOf(PropTypes.object),
    udpValueText: PropTypes.string,
  }),
};

export default memo(StorageCapacityWatchWidget);
