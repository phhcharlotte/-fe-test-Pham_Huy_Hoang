import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  selectFiltersState,
  selectSortState,
  setFilter,
  setSortConfig,
} from "../stores/TaskSlice";
import type { TaskFilters, SortConfig } from "../types";

/**
 * Persist filters + sortConfig vào URL query params (2 chiều):
 *  - Khi filters/sort thay đổi → cập nhật URL
 *  - Khi load trang → đọc URL → khôi phục filters/sort vào Redux
 */
export function useUrlFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFiltersState);
  const sortConfig = useAppSelector(selectSortState);
  const isFirstRender = useRef(true);

  // ── 1. Load từ URL khi mount ──────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const f: Partial<TaskFilters> = {};

    const searchText = params.get("q");
    if (searchText) f.searchText = searchText;

    const status = params.getAll("status");
    if (status.length) f.status = status as TaskFilters["status"];

    const priority = params.get("priority");
    if (priority) f.priority = priority as TaskFilters["priority"];

    const dateFrom = params.get("dateFrom");
    const dateTo = params.get("dateTo");
    if (dateFrom || dateTo) f.dateRange = [dateFrom ?? "", dateTo ?? ""];

    if (Object.keys(f).length) dispatch(setFilter(f));

    const sortKey = params.get("sortKey");
    const sortDir = params.get("sortDir");
    if (sortKey && (sortDir === "asc" || sortDir === "desc")) {
      dispatch(
        setSortConfig({ key: sortKey as SortConfig["key"], dir: sortDir }),
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 2. Sync Redux → URL khi filters/sort thay đổi ────────────────────────
  useEffect(() => {
    // Bỏ qua lần render đầu để tránh ghi đè URL trước khi load xong
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams();

    if (filters.searchText) params.set("q", filters.searchText);
    filters.status.forEach((s) => params.append("status", s));
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.dateRange[0]) params.set("dateFrom", filters.dateRange[0]);
    if (filters.dateRange[1]) params.set("dateTo", filters.dateRange[1]);
    if (sortConfig.key) {
      params.set("sortKey", sortConfig.key as string);
      params.set("sortDir", sortConfig.dir);
    }

    const search = params.toString();
    const newUrl = search
      ? `${window.location.pathname}?${search}`
      : window.location.pathname;

    // replaceState để không làm đầy history stack
    window.history.replaceState(null, "", newUrl);
  }, [filters, sortConfig]);
}
