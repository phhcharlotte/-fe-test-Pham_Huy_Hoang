import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  Typography,
  Badge,
} from "antd";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useDebounce } from "../hooks/useDebounce";
import {
  selectFilteredTasks,
  selectFiltersState,
  selectPaginationInfo,
  selectSortState,
  addTask,
  updateTask,
  deleteTask,
  deleteManyTasks,
  updateTaskStatus,
  setFilter,
  resetFilters,
  setPage,
  setSortConfig,
} from "../stores/TaskSlice";
import { StatusBadge, PriorityBadge, Avatar } from "../components/ui";
import { TaskModal } from "../components/TaskModal";
import { useNotify } from "../components/Notification";
import { formatDate, daysDiff } from "../utils/helpers";
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { Task } from "../types";

const { RangePicker } = DatePicker;
const { Text } = Typography;

export default function TaskList() {
  const dispatch = useAppDispatch();
  const { notify } = useNotify();

  const filteredTasks = useAppSelector(selectFilteredTasks);
  const pagination = useAppSelector(selectPaginationInfo);
  const filters = useAppSelector(selectFiltersState);
  const sortConfig = useAppSelector(selectSortState);

  const [modal, setModal] = useState<"new" | Task | null>(null);
  const [selected, setSelected] = useState<React.Key[]>([]);
  const [searchInput, setSearchInput] = useState(filters.searchText);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    dispatch(setFilter({ searchText: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  // paginate client-side via antd Table
  const paginatedData = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    return filteredTasks.slice(start, start + pagination.pageSize);
  }, [filteredTasks, pagination]);

  const handleSave = (task: Task) => {
    if (modal === "new") {
      dispatch(addTask(task));
      notify("✨ Đã tạo task mới");
    } else {
      dispatch(updateTask(task));
      notify("💾 Đã cập nhật task");
    }
    setModal(null);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTask(id));
    notify("Đã xóa task", "error");
  };

  const handleBulkDelete = () => {
    dispatch(deleteManyTasks(selected as string[]));
    notify(`Đã xóa ${selected.length} task`, "error");
    setSelected([]);
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
      sorter: true,
      sortOrder:
        sortConfig.key === "title"
          ? sortConfig.dir === "asc"
            ? "ascend"
            : "descend"
          : null,
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
          onChange={(s) =>
            dispatch(updateTaskStatus({ id: record.id, status: s }))
          }
        />
      ),
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 130,
      sorter: true,
      sortOrder:
        sortConfig.key === "priority"
          ? sortConfig.dir === "asc"
            ? "ascend"
            : "descend"
          : null,
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
            <Avatar name={assignee} size={22} />
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
      sorter: true,
      sortOrder:
        sortConfig.key === "dueDate"
          ? sortConfig.dir === "asc"
            ? "ascend"
            : "descend"
          : null,
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
            {isOverdue && (
              <div className="text-xs text-red-400">Trễ {-diff!} ngày</div>
            )}
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
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: 150,
      render: (tags?: string[]) => (
        <div className="flex flex-wrap gap-1">
          {(tags ?? []).slice(0, 2).map((t) => (
            <Tag key={t} color="purple" style={{ fontSize: 10, margin: 0 }}>
              {t}
            </Tag>
          ))}
          {(tags ?? []).length > 2 && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              +{tags!.length - 2}
            </Text>
          )}
        </div>
      ),
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
      {/* Filters bar */}
      <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex flex-wrap gap-2 items-center">
        <Input.Search
          placeholder="Tìm kiếm tiêu đề, mô tả, tags..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onSearch={(v) => {
            setSearchInput(v);
            dispatch(setFilter({ searchText: v }));
          }}
          allowClear
          style={{ width: 240 }}
          prefix={<SearchOutlined className="text-gray-400" />}
        />

        <Select
          mode="multiple"
          placeholder="Trạng thái"
          value={filters.status}
          onChange={(v) => dispatch(setFilter({ status: v }))}
          style={{ minWidth: 160 }}
          options={[
            { value: "todo", label: "⏳ Chờ xử lý" },
            { value: "in_progress", label: "🔄 Đang làm" },
            { value: "done", label: "✅ Hoàn thành" },
          ]}
          allowClear
        />

        <Select
          placeholder="Độ ưu tiên"
          value={filters.priority || undefined}
          onChange={(v) => dispatch(setFilter({ priority: v ?? "" }))}
          allowClear
          style={{ width: 150 }}
          options={[
            { value: "high", label: "🔴 Cao" },
            { value: "medium", label: "🟡 Trung bình" },
            { value: "low", label: "🟢 Thấp" },
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
            dispatch(setFilter({ dateRange: strs as [string, string] }))
          }
          style={{ width: 240 }}
        />

        {hasFilters && (
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              dispatch(resetFilters());
              setSearchInput("");
            }}>
            Reset
          </Button>
        )}

        <span className="ml-auto text-xs text-gray-400">
          {filteredTasks.length} kết quả
        </span>
      </div>

      {/* Bulk bar */}
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

      {/* Table */}
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
            onChange: (page) => dispatch(setPage(page)),
          }}
          locale={{
            emptyText: (
              <div className="py-12 text-center">
                <div className="text-4xl mb-3">{hasFilters ? "🔍" : "📭"}</div>
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
