import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Tooltip,
  Popconfirm,
  Typography,
  Badge,
  Spin,
} from "antd";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useDebounce } from "../hooks/useDebounce";
import { useLoading } from "../hooks/useLoading";
import {
  selectFilteredTasks,
  selectFiltersState,
  selectPaginationInfo,
  selectIsLoading,
  addTask,
  updateTask,
  deleteTask,
  deleteManyTasks,
  updateTaskStatus,
  setFilter,
  resetFilters,
  setPage,
  setSortConfig,
  startLoading,
} from "../stores/TaskSlice";
import { StatusBadge, PriorityBadge } from "../components/ui";
import TaskModal from "../components/TaskModal";
import { useNotify } from "../components/Notification";
import { formatDate, daysDiff } from "../utils/helpers";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import type { Task } from "../types";

const { RangePicker } = DatePicker;
const { Text } = Typography;

function TaskList() {
  const dispatch = useAppDispatch();
  const { notify } = useNotify();
  const { withLoading } = useLoading();

  const filteredTasks = useAppSelector(selectFilteredTasks);
  const pagination = useAppSelector(selectPaginationInfo);
  const filters = useAppSelector(selectFiltersState);
  const isFilterLoading = useAppSelector(selectIsLoading("filter"));

  const [modal, setModal] = useState<"new" | Task | null>(null);
  const [selected, setSelected] = useState<React.Key[]>([]);
  const [searchInput, setSearchInput] = useState(filters.searchText);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    if (debouncedSearch !== filters.searchText) {
      dispatch(startLoading("filter"));
    }
    dispatch(setFilter({ searchText: debouncedSearch }));
  }, [debouncedSearch]);

  const handleSave = async (task: Task) => {
    if (modal === "new") {
      await withLoading("addTask", () => dispatch(addTask(task)));
      notify(" Đã tạo task mới");
    } else {
      await withLoading("updateTask", () => dispatch(updateTask(task)));
      notify(" Đã cập nhật task");
    }
    setModal(null);
  };

  const handleDelete = async (id: string) => {
    await withLoading("deleteTask", () => dispatch(deleteTask(id)));
    notify("Đã xóa task", "error");
  };

  const handleBulkDelete = async () => {
    await withLoading("deleteManyTasks", () =>
      dispatch(deleteManyTasks(selected as string[])),
    );
    notify(`Đã xóa ${selected.length} task`, "error");
    setSelected([]);
  };

  const handleStatusChange = async (id: string, status: Task["status"]) => {
    await withLoading("updateStatus", () =>
      dispatch(updateTaskStatus({ id, status })),
    );
  };

  const handleFilterChange = (partial: Parameters<typeof setFilter>[0]) => {
    dispatch(startLoading("filter"));
    dispatch(setFilter(partial));
  };

  const handlePageChange = (page: number) => {
    dispatch(startLoading("filter"));
    dispatch(setPage(page));
  };

  const handleReset = () => {
    dispatch(startLoading("filter"));
    dispatch(resetFilters());
    setSearchInput("");
  };

  const hasFilters =
    filters.searchText ||
    filters.status.length ||
    filters.priority ||
    filters.dateRange[0];

  const columns: TableProps<Task>["columns"] = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title: string, record) => (
        <div>
          <div className="font-semibold text-gray-900 text-sm">{title}</div>
          {record.description && (
            <div className="text-xs text-gray-400 truncate max-w-[240px]">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: Task["status"], record) => (
        <StatusBadge
          status={status}
          editable
          onChange={(s) => handleStatusChange(record.id, s)}
        />
      ),
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 130,
      sorter: (a, b) => {
        const m: Record<string, number> = { high: 3, medium: 2, low: 1 };
        return (m[a.priority] ?? 0) - (m[b.priority] ?? 0);
      },
      render: (priority: Task["priority"]) => (
        <PriorityBadge priority={priority} />
      ),
    },
    {
      title: "Người giao",
      dataIndex: "assignee",
      key: "assignee",
      width: 160,
      render: (assignee?: string) =>
        assignee ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {assignee.split(" ").slice(-2).join(" ")}
            </span>
          </div>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Hạn chót",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 130,
      sorter: (a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""),
      render: (dueDate?: string, record?) => {
        if (!dueDate) return <Text type="secondary">—</Text>;
        const diff = daysDiff(dueDate);
        const isOverdue =
          diff !== null && diff < 0 && record?.status !== "done";
        const isDueSoon =
          diff !== null && diff >= 0 && diff <= 3 && record?.status !== "done";
        return (
          <div>
            <div
              className={`text-xs font-semibold ${isOverdue ? "text-red-500" : isDueSoon ? "text-yellow-500" : "text-gray-600"}`}>
              {formatDate(dueDate)}
            </div>
            {isDueSoon && !isOverdue && (
              <div className="text-xs text-yellow-400">
                {diff === 0 ? "Hôm nay" : `Còn ${diff} ngày`}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 90,
      fixed: "right",
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => setModal(record)}
              style={{ color: "#6366f1" }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa task này?"
              description="Task sẽ bị xóa vĩnh viễn và không thể khôi phục."
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id)}>
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex flex-wrap gap-2 items-center">
        <Input.Search
          placeholder="Tìm kiếm tiêu đề, mô tả, tags..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onSearch={(v) => {
            setSearchInput(v);
            handleFilterChange({ searchText: v });
          }}
          allowClear
          onClear={() => {
            setSearchInput("");
            handleFilterChange({ searchText: "" });
          }}
          style={{ width: 240 }}
          prefix={
            isFilterLoading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    spin
                    style={{ fontSize: 12, color: "#6366f1" }}
                  />
                }
              />
            ) : (
              <SearchOutlined className="text-gray-400" />
            )
          }
        />

        <Select
          mode="multiple"
          placeholder="Trạng thái"
          value={filters.status}
          onChange={(v) => handleFilterChange({ status: v })}
          style={{ minWidth: 160 }}
          options={[
            { value: "todo", label: " Chờ xử lý" },
            { value: "in_progress", label: " Đang làm" },
            { value: "done", label: " Hoàn thành" },
          ]}
          allowClear
        />

        <Select
          placeholder="Độ ưu tiên"
          value={filters.priority || undefined}
          onChange={(v) => handleFilterChange({ priority: v ?? "" })}
          allowClear
          style={{ width: 150 }}
          options={[
            { value: "high", label: " Cao" },
            { value: "medium", label: " Trung bình" },
            { value: "low", label: " Thấp" },
          ]}
        />

        <RangePicker
          placeholder={["Từ ngày", "Đến ngày"]}
          format="DD/MM/YYYY"
          value={
            filters.dateRange[0] && filters.dateRange[1]
              ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])]
              : null
          }
          onChange={(_, strs) =>
            handleFilterChange({ dateRange: strs as [string, string] })
          }
          style={{ width: 240 }}
        />

        {hasFilters && (
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        )}

        <span className="ml-auto text-xs text-gray-400 flex items-center gap-1.5">
          {isFilterLoading && (
            <Spin
              indicator={
                <LoadingOutlined
                  spin
                  style={{ fontSize: 11, color: "#6366f1" }}
                />
              }
            />
          )}
          {filteredTasks.length} kết quả
        </span>
      </div>

      {selected.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <Badge count={selected.length} color="#6366f1" />
          <span className="text-sm font-semibold text-indigo-700">
            task đã chọn
          </span>
          <div className="flex-1" />
          <Popconfirm
            title={`Xóa ${selected.length} task?`}
            description="Thao tác này không thể hoàn tác."
            okText="Xóa tất cả"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={handleBulkDelete}>
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa {selected.length} task
            </Button>
          </Popconfirm>
          <Button size="small" onClick={() => setSelected([])}>
            Bỏ chọn
          </Button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <Table
          rowKey="id"
          dataSource={filteredTasks}
          columns={columns}
          rowSelection={{
            selectedRowKeys: selected,
            onChange: (keys) => setSelected(keys),
          }}
          onChange={(_, __, sorter) => {
            const s = Array.isArray(sorter) ? sorter[0] : sorter;
            if (s?.field && s?.order) {
              dispatch(
                setSortConfig({
                  key: s.field as any,
                  dir: s.order === "ascend" ? "asc" : "desc",
                }),
              );
            }
          }}
          pagination={{
            current: pagination.currentPage,
            pageSize: pagination.pageSize,
            total: filteredTasks.length,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} task`,
            showSizeChanger: false,
            onChange: handlePageChange,
          }}
          locale={{
            emptyText: (
              <div className="py-12 text-center">
                <div className="font-semibold text-gray-500 mb-1">
                  {hasFilters ? "Không tìm thấy kết quả" : "Chưa có task nào"}
                </div>
                <div className="text-xs text-gray-400">
                  {hasFilters
                    ? "Thử thay đổi bộ lọc"
                    : 'Nhấn "+ Thêm task" để bắt đầu'}
                </div>
              </div>
            ),
          }}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </div>

      {modal !== null && (
        <TaskModal
          task={modal === "new" ? null : modal}
          open={true}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default TaskList;
