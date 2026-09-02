import React from "react";
import { Box } from "@mui/material";
import SplitPageLayout from "../../layout/SplitPageLayout";
import ListToolbar from "../../components/ListToolbar";
import DataTable from "../../components/DataTable";

export default function Logs() {
  const [selectedId, setSelectedId] = React.useState("all");

  const items = [
    { id: "all", label: "All Logs", count: 100 },
    { id: "machines", label: "Assured Recovery", count: 2 },
    {
      id: "no-plan",
      label: "Assured Security - AI Anomaly Detection",
      count: 30,
    },
    {
      id: "agentless",
      label: "Assured Security - Malware Scan",
      count: 60,
    },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "firstName",
      headerName: "First name",
      flex: 1,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Last name",
      flex: 1,
      editable: true,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      flex: 1,
      editable: true,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      flex: 1,
      valueGetter: (value, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`,
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  return (
    <SplitPageLayout
      rootLabel="Logs"
      items={items}
      selectedId={selectedId}
      onSelect={setSelectedId}
    >
      <Box>
        <ListToolbar
          showSearch
          searchPlaceholder="Search logs"
          selectedCount={4}
        />
        <DataTable ariaLabel="Logs" columns={columns} rows={rows} />
      </Box>
    </SplitPageLayout>
  );
}
