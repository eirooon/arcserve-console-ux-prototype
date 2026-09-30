import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useGridApiRef } from "@mui/x-data-grid";
import DataTable from "../../../components/DataTable";
import ConfirmDialog from "../../../components/ConfirmDialog";
import EntityFormDialog from "../../../components/EntityFormDialog";
import { useEntityFilterState } from "../../../hooks/useEntityFilterState";
import { getInfrastructureFilterConfig } from "../hooks/infrastructureFilters";
import { PENDING_ADMIN_STATUS } from "../hooks/cloudServices";
import {
  CLOUD_ACCOUNT_DELETE,
  SITE_DELETE,
  useInfrastructureRowDelete,
} from "../hooks/useInfrastructureRowDelete";
import { canRedeploySite } from "../hooks/siteStatus";
import { redeploySite } from "../hooks/siteActions";
import { cancelAdminSetupRequest, resendAdminSetupLink } from "../hooks/azure/azureAdminHandoff";
import {
  filterInfrastructureByCategory,
  getInfrastructureTableConfig,
  infrastructureStore,
  useInfrastructureData,
} from "../hooks/useInfrastructureData";

// Module-level so DataTable's memoized Actions column isn't rebuilt each render.
const rowActionsAriaLabel = (row) => `Actions for ${row.name}`;

export default function InfrastructuresTable() {
  const { selectedId } = useOutletContext();
  const { rows, loading, selectionModel, dialog, saving } = useInfrastructureData();
  const apiRef = useGridApiRef();
  const navigate = useNavigate();
  useEffect(() => infrastructureStore.setApiRef(apiRef), [apiRef]);

  // Entity filters/search (see InfrastructuresToolbar, which independently
  // computes the same categoryRows against the shared
  // infrastructureFilterStore) apply on top of whichever left sub-nav
  // category is currently selected.
  const categoryRows = useMemo(
    () => filterInfrastructureByCategory(rows, selectedId),
    [rows, selectedId],
  );
  const { filterStore } = getInfrastructureFilterConfig(selectedId);
  const { filteredRows } = useEntityFilterState(filterStore, categoryRows);
  const { columns, fields } = getInfrastructureTableConfig(selectedId);

  // Only Cloud Accounts and Sites show the leading per-row Actions column.
  const isCloudAccounts = selectedId === "cloud-accounts";
  const isSites = selectedId === "sites";

  // Azure accounts connected through the wizard have their own Modify page;
  // everything else still edits in the generic form.
  const modify = useCallback(
    (row) =>
      row.azure ? navigate(`/infrastructures/cloud-accounts/${row.id}`) : infrastructureStore.openEdit(row),
    [navigate],
  );

  const { confirm: deleteConfirm, requestDelete } = useInfrastructureRowDelete(
    isSites ? SITE_DELETE : CLOUD_ACCOUNT_DELETE,
  );

  // A pending setup request already has "Cancel request", which removes it.
  const cloudAccountRowActions = useCallback(
    (row) =>
      row.status === PENDING_ADMIN_STATUS
        ? [
            {
              items: [
                { label: "Resend setup link", onClick: () => resendAdminSetupLink(row) },
                { label: "Cancel request", onClick: () => cancelAdminSetupRequest(row) },
              ],
            },
          ]
        : [
            {
              items: [
                { label: "Modify", onClick: () => modify(row) },
                { label: "Delete", onClick: () => requestDelete(row) },
              ],
            },
          ],
    [modify, requestDelete],
  );

  const siteRowActions = useCallback(
    (row) => [
      {
        items: [
          { label: "Modify", onClick: () => infrastructureStore.openEdit(row) },
          { label: "Redeploy", onClick: () => redeploySite(row), disabled: !canRedeploySite(row) },
          { label: "Delete", onClick: () => requestDelete(row) },
        ],
      },
    ],
    [requestDelete],
  );

  const rowActions = isCloudAccounts ? cloudAccountRowActions : isSites ? siteRowActions : undefined;

  // The form only submits its visible fields, so re-attach what keeps the row
  // in this category (type) plus the columns the form doesn't edit.
  const handleCloudAccountSubmit = (values) =>
    infrastructureStore.save({
      type: "cloud_account",
      lastRefresh: new Date().toISOString(),
      policyCount: 0,
      ...dialog?.row,
      ...values,
    });

  // New sites start deploying; edits keep the row's status/progress.
  const handleSiteSubmit = (values) =>
    infrastructureStore.save({
      type: "site",
      status: "deploying",
      deployProgress: 0,
      version: "1.1",
      lastContact: new Date().toISOString(),
      ...dialog?.row,
      ...values,
    });

  const handleSubmit = isCloudAccounts
    ? handleCloudAccountSubmit
    : isSites
      ? handleSiteSubmit
      : infrastructureStore.save;

  return (
    <>
      <DataTable
        ariaLabel="Infrastructure"
        columns={columns}
        rows={filteredRows}
        loading={loading}
        getRowId={(row) => row.id}
        apiRef={apiRef}
        rowActions={rowActions}
        rowActionsAriaLabel={rowActions ? rowActionsAriaLabel : undefined}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={infrastructureStore.setSelectionModel}
        onRowDoubleClick={(params) =>
          isCloudAccounts && params.row.status !== PENDING_ADMIN_STATUS
            ? modify(params.row)
            : infrastructureStore.openEdit(params.row)
        }
      />
      <EntityFormDialog
        open={Boolean(dialog)}
        mode={dialog?.mode}
        entityLabel={isSites ? "Site" : "Infrastructure"}
        fields={fields}
        initialValues={dialog?.row}
        saving={saving}
        onClose={infrastructureStore.closeDialog}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog {...deleteConfirm} />
    </>
  );
}
