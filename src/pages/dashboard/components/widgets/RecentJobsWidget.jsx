import React, { memo, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Pagination,
  IconButton,
  Link,
  LinearProgress,
} from "@mui/material";
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  MoreVert,
} from "@mui/icons-material";
import CardWidget from "../../../../components/CardWidget";

function RecentJobsWidget({
  data,
  pageSize = 5,
  title,
  description,
  getItemKey,
  emptyState,
}) {
  const [page, setPage] = useState(1);

  const safeItems = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(safeItems.length / pageSize));
  const clampedPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (clampedPage - 1) * pageSize;
    return safeItems.slice(start, start + pageSize);
  }, [safeItems, clampedPage, pageSize]);

  const onPageChange = (_, value) => setPage(value);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const CustomProgress = ({ value, height = 4 }) => {
    const v = Math.max(0, Math.min(100, Number(value) || 0));

    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          value={v}
          sx={{
            height,
            borderRadius: 999,
            bgcolor: (theme) => theme.palette.grey[200],
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
            },
          }}
        />
      </Box>
    );
  };

  return (
    <CardWidget title={title} description={description}>
      <Box
        sx={{
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
          minHeight: "360px",
        }}
      >
        {pageItems.length === 0 ? (
          <Box sx={{ p: 3 }}>
            {emptyState ?? (
              <Typography color="text.secondary">
                No priority items right now.
              </Typography>
            )}
          </Box>
        ) : (
          pageItems.map((item, idx) => {
            const key = getItemKey
              ? getItemKey(item)
              : (item?.id ?? `${clampedPage}-${idx}`);

            return (
              <React.Fragment key={key}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "center",
                    columnGap: 2,
                    pr: 2,
                    pl: 2,
                    pt: 1,
                    pb: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Link
                      variant="body2"
                      sx={{ fontWeight: 600, lineHeight: 2 }}
                      color="secondary"
                      href="#"
                      underline="none"
                    >
                      {item?.jobName}
                    </Link>

                    <CustomProgress value={item?.progressValue ?? 0} />

                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mt: 0.5 }}
                    >
                      {item?.progressValue}% • {item?.jobType} • {item?.time}
                    </Typography>
                  </Box>

                  <Box sx={{ pt: 0.4, justifySelf: "end" }}>
                    <IconButton aria-label="more" size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>

                {idx !== pageItems.length - 1 ? <Divider /> : null}
              </React.Fragment>
            );
          })
        )}
      </Box>

      {/* Pagination row */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ mt: 2 }}
      >
        <IconButton
          aria-label="previous page"
          onClick={handlePrev}
          disabled={clampedPage <= 1}
          size="small"
        >
          <ChevronLeftRounded />
        </IconButton>

        <Pagination
          count={totalPages}
          page={clampedPage}
          onChange={onPageChange}
          hidePrevButton
          hideNextButton
          siblingCount={1}
          boundaryCount={1}
          shape="circular"
        />

        <IconButton
          aria-label="next page"
          onClick={handleNext}
          disabled={clampedPage >= totalPages}
          size="small"
        >
          <ChevronRightRounded />
        </IconButton>
      </Stack>
    </CardWidget>
  );
}

export default memo(RecentJobsWidget);
