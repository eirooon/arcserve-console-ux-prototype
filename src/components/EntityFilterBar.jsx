import PropTypes from "prop-types";
import { Box, Button, Chip, Divider, Typography } from "@mui/material";

function ResultsLine({ count, children }) {
  return (
    <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "nowrap" }}>
      Showing{" "}
      <Box component="span" sx={{ fontWeight: 700 }}>
        {count}
      </Box>{" "}
      {children}
    </Typography>
  );
}

/**
 * The row(s) shown below a list page's toolbar once filters/search are in
 * play (see useEntityFilterState, EntityFiltersDialog, SaveSearchDialog —
 * first built for the Jobs page, now shared by every list page that wants
 * the same filter/search flow). Independent rows, any of which may be
 * absent:
 *  - "Saved Searches" — a single-select chip per saved search, shown
 *    whenever at least one exists, with the active one highlighted.
 *  - Either the active saved search's result line, or — when filtering
 *    ad-hoc instead (no saved search selected) — the removable filter chips
 *    plus "Clear All"/"Save Search".
 *  - The free-text search box's result line, shown independently of (and
 *    possibly alongside) the two above, since a search term narrows
 *    whatever else is already active rather than replacing it.
 */
export default function EntityFilterBar({
  resultCount,
  savedSearches,
  activeSavedSearchId,
  onSelectSavedSearch,
  filterChips,
  onRemoveFilter,
  onClearAll,
  onSaveSearch,
  searchText,
  onClearSearch,
}) {
  const activeSavedSearch = savedSearches.find((search) => search.id === activeSavedSearchId);
  const showAdHocRow = filterChips.length > 0 && !activeSavedSearch;
  const showSavedSearchesRow = savedSearches.length > 0;
  const showSearchRow = searchText.trim().length > 0;

  if (!showSavedSearchesRow && !showAdHocRow && !activeSavedSearch && !showSearchRow) return null;

  return (
    <Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
      {showSavedSearchesRow && (
        <>
          <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography variant="body2" color="text.primary" sx={{ mr: 0.5, whiteSpace: "nowrap" }}>
              Saved Searches:
            </Typography>
            {savedSearches.map((search) => (
              <Chip
                key={search.id}
                label={search.name}
                color={search.id === activeSavedSearchId ? "primary" : "default"}
                onClick={() => onSelectSavedSearch(search.id)}
              />
            ))}
          </Box>
          {(showAdHocRow || activeSavedSearch || showSearchRow) && <Divider />}
        </>
      )}

      {activeSavedSearch && (
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <ResultsLine count={resultCount}>
            results for saved search &quot;{activeSavedSearch.name}&quot;
          </ResultsLine>
          <Button size="small" color="secondary" onClick={onClearAll}>
            Clear
          </Button>
        </Box>
      )}

      {showAdHocRow && (
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <ResultsLine count={resultCount}>results for:</ResultsLine>
          {filterChips.map((chip) => (
            <Chip key={chip.key} label={chip.label} size="small" onDelete={() => onRemoveFilter(chip.key)} />
          ))}
          <Button size="small" color="secondary" onClick={onClearAll}>
            Clear All
          </Button>
          <Button size="small" color="secondary" onClick={onSaveSearch}>
            Save Search
          </Button>
        </Box>
      )}

      {showSearchRow && (
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <ResultsLine count={resultCount}>
            results for{" "}
            <Box component="span" sx={{ fontWeight: 700 }}>
              &quot;{searchText}&quot;
            </Box>
          </ResultsLine>
          <Button size="small" color="secondary" onClick={onClearSearch}>
            Clear
          </Button>
        </Box>
      )}
    </Box>
  );
}

EntityFilterBar.propTypes = {
  resultCount: PropTypes.number,
  savedSearches: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, name: PropTypes.string.isRequired }),
  ).isRequired,
  activeSavedSearchId: PropTypes.string,
  onSelectSavedSearch: PropTypes.func.isRequired,
  filterChips: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string, label: PropTypes.string }))
    .isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
  onSaveSearch: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
  onClearSearch: PropTypes.func.isRequired,
};
