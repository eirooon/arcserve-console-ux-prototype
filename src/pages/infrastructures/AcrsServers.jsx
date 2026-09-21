import AcrsServersToolbar from "./components/AcrsServersToolbar";
import AcrsServersTable from "./components/AcrsServersTable";
import { useAcrsServersData } from "./hooks/useAcrsServersData";
import { useEntityFilterState } from "../../hooks/useEntityFilterState";
import { acrsServersFilterStore } from "./hooks/acrsServersFilters";

const selectRows = (state) => ({ rows: state.rows });

export default function AcrsServers() {
  const { rows } = useAcrsServersData(selectRows);
  const { filteredRows } = useEntityFilterState(acrsServersFilterStore, rows);

  return (
    <>
      <AcrsServersToolbar />
      <AcrsServersTable rows={filteredRows} />
    </>
  );
}
