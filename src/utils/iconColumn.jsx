import IconCell from "../components/IconCell";

/**
 * A DataGrid column whose cell is a single meaning-bearing icon (with an
 * accessible label) instead of the raw enum string — see IconCell.
 * `resolveMeta` maps a row to `{ icon, label, color } | null`; sorting and
 * filtering still operate on the underlying `field` value since only the
 * display changes. First built for the Sources table's Type/OS/Status/
 * Connection columns; reusable by any page that wants the same treatment.
 */
export function iconColumn(field, headerName, resolveMeta) {
  return {
    field,
    headerName,
    width: 110,
    renderCell: ({ row }) => {
      const meta = resolveMeta(row);
      return <IconCell icon={meta?.icon} label={meta?.label} color={meta?.color} />;
    },
  };
}
