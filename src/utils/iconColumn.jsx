import IconCell from "../components/IconCell";

/**
 * A DataGrid column whose cell is a single meaning-bearing icon (with an
 * accessible label) instead of the raw enum string — see IconCell.
 * `resolveMeta` maps a row to `{ icon, label, color } | null`; sorting and
 * filtering still operate on the underlying `field` value since only the
 * display changes. First built for the Sources table's Type/OS/Status/
 * Connection columns; reusable by any page that wants the same treatment.
 *
 * Pass `showLabel: true` (e.g. the Jobs table's Status column) to render the
 * label as visible text next to the icon instead of an icon-only cell with a
 * tooltip; `flex`/`width` size the column same as any other DataGrid column.
 */
export function iconColumn(field, headerName, resolveMeta, { width = 110, flex, showLabel = false } = {}) {
  return {
    field,
    headerName,
    ...(flex ? { flex } : { width }),
    renderCell: ({ row }) => {
      const meta = resolveMeta(row);
      return (
        <IconCell icon={meta?.icon} label={meta?.label} color={meta?.color} showLabel={showLabel} />
      );
    },
  };
}
