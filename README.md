# TaskBoard 📋

Ứng dụng quản lý công việc nội bộ, xây dựng với React 18 + TypeScript + Redux Toolkit + Tailwind CSS + Vite.

## Công nghệ sử dụng

| Tech          | Version    | Mục đích         |
| ------------- | ---------- | ---------------- |
| React         | 18         | UI framework     |
| TypeScript    | 5 (strict) | Type safety      |
| Redux Toolkit | 2.x        | State management |
| Tailwind CSS  | 3.x        | Styling          |
| Vite          | latest     | Build tool       |

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

## Selectors (createSelector)

- `selectAllTasks` — toàn bộ task
- `selectFilteredTasks` — áp dụng filters + sort
- `selectPaginatedTasks` — task của trang hiện tại
- `selectTaskStats` — { total, todo, inProgress, done, highPriority, overdue }
- `selectRecentTasks` — 5 task mới nhất

## Actions

`addTask` · `updateTask` · `deleteTask` · `deleteManyTasks` · `updateTaskStatus` · `setFilter` · `resetFilters` · `setPage` · `setSortConfig`

## Tính năng

- **Dashboard**: 4 stat cards, recent tasks
- **Danh sách task**: table phân trang, sort 3 cột, inline status change, bulk delete
- **Tìm kiếm & lọc**: debounce search, multi-select status, filter priority, date range picker
- **CRUD**: Modal thêm/sửa với validation, confirm trước khi xóa
- **Toast notifications**: phản hồi mọi thao tác

Sử dụng thêm thư viện dayjs: để dễ dàng format thời gian
