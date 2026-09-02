import { useMemo } from "react";
import { Typography } from "@mui/material";
import StatusPill from "../components/StatusPill";
import CellContent from "../components/DataGridCellContent";
import SourceActionSplitButton from "../components/SourceActionSplitButton";
import { SOURCE_STATUS_META } from "../arcGenieOverviewData";

export function useAutoProtectSourcesColumns({ onPrimaryAction, onOpenMenu }) {
  return useMemo(
    () => [
      {
        field: "sourceName",
        headerName: "Source Name",
        flex: 1.5,
        renderCell: (params) => (
          <CellContent>
            <Typography variant="body2" color="secondary.main" fontWeight={500}>
              {params.value}
            </Typography>
          </CellContent>
        ),
      },
      { field: "sourceType", headerName: "Source Type", flex: 1 },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        valueGetter: (value) => SOURCE_STATUS_META[value]?.label ?? value,
        renderCell: (params) => {
          const statusMeta = SOURCE_STATUS_META[params.row.status];
          return (
            <CellContent>
              <StatusPill label={statusMeta.label} bgcolor={statusMeta.bgColor} color={statusMeta.color} />
            </CellContent>
          );
        },
      },
      { field: "currentPlan", headerName: "Current Plan", flex: 1 },
      { field: "proposedPlan", headerName: "Proposed Plan", flex: 1 },
      {
        field: "actions",
        headerName: "Actions",
        width: 160,
        sortable: false,
        filterable: false,
        resizable: false,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <CellContent justifyContent="flex-end">
            <SourceActionSplitButton
              label={params.row.actionLabel}
              sourceName={params.row.sourceName}
              onPrimaryAction={() => onPrimaryAction(params.row)}
              onOpenMenu={(event) => onOpenMenu(event, params.row.id)}
            />
          </CellContent>
        ),
      },
    ],
    [onPrimaryAction, onOpenMenu],
  );
}
