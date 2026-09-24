import { useCallback, useMemo } from "react";
import { Link, Typography } from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import { ENDPOINTS } from "../../../api/endpoints";
import {
  createResourceStore,
  useResourceStore,
} from "../../../api/createResourceStore";

const STATUS_META = {
  Pending: { icon: AccessTimeFilledIcon, color: "warning.main" },
  Online: { icon: CheckCircleRoundedIcon, color: "success.main" },
  Offline: { icon: ErrorRoundedIcon, color: "error.main" },
};

function formatStorage(usedGb, totalGb) {
  const format = (gb) =>
    gb >= 1000 ? `${(gb / 1000).toFixed(2)} TB` : `${gb} GB`;
  return `${format(usedGb)} / ${format(totalGb)}`;
}

function formatCreatedDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "-";
  const datePart = date.toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const timePart = date
    .toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    .replace(" ", "");
  return `${datePart} ${timePart}`;
}

export function useAcrsServersColumns(navigate) {
  return useMemo(
    () => [
      {
        field: "displayName",
        headerName: "Display Name",
        flex: 1.5,
        minWidth: 160,
        renderCell: ({ row, value }) => {
          if (!value) return "-";
          return (
            <Link
              component="button"
              type="button"
              variant="body2"
              color="secondary"
              underline="hover"
              onClick={() =>
                navigate(
                  `/infrastructures/arcserve-cyber-resilient-servers/${row.id}`,
                )
              }
            >
              {value}
            </Link>
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        width: 160,
        renderCell: ({ value }) => {
          const meta = STATUS_META[value];
          if (!meta) return value ?? "-";
          const Icon = meta.icon;
          return (
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                height: "100%",
                color: "text.primary",
              }}
            >
              <Icon fontSize="small" sx={{ color: meta.color }} />
              {value}
            </Typography>
          );
        },
      },
      {
        field: "hostnameIp",
        headerName: "Hostname/IP Address",
        flex: 1,
        minWidth: 160,
      },
      { field: "site", headerName: "Site", flex: 1, minWidth: 120 },
      {
        field: "storage",
        headerName: "Storage (Used/Total)",
        flex: 1,
        minWidth: 160,
        valueGetter: (_value, row) =>
          formatStorage(row.storageUsedGb, row.storageTotalGb),
      },
      {
        field: "createdDate",
        headerName: "Created Date",
        flex: 1,
        minWidth: 160,
        valueGetter: (value) => formatCreatedDate(value),
      },
    ],
    [navigate],
  );
}

export function useAcrsServersRowActions(navigate, { onModify, onDelete }) {
  return useCallback(
    (row) => [
      {
        items: [
          { label: "Modify", onClick: () => onModify(row) },
          {
            label: "Manage File Systems",
            onClick: () =>
              navigate(
                `/infrastructures/arcserve-cyber-resilient-servers/${row.id}`,
                {
                  state: { tab: "file-systems" },
                },
              ),
          },
          {
            label: "Manage Networks",
            onClick: () =>
              navigate(
                `/infrastructures/arcserve-cyber-resilient-servers/${row.id}`,
                {
                  state: { tab: "networks" },
                },
              ),
          },
          { label: "Delete", onClick: () => onDelete(row) },
        ],
      },
    ],
    [navigate, onModify, onDelete],
  );
}

export const acrsServersStore = createResourceStore(ENDPOINTS.ACRS_SERVERS);

export function useAcrsServersData(selector) {
  return useResourceStore(acrsServersStore, selector);
}
