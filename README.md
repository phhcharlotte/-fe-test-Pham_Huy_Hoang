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

## Cấu trúc thư mục

```
src/
├── types/          # TypeScript interfaces (Task, TaskFilters, ...)
├── data/           # Mock data (22 tasks mẫu, danh sách users)
├── store/          # Redux store
│   ├── index.ts    # configureStore
│   └── tasksSlice.ts  # slice + createSelector selectors
├── hooks/          # Custom hooks
│   ├── redux.ts    # useAppDispatch, useAppSelector
│   └── useDebounce.ts
├── utils/          # Helper functions
│   └── helpers.ts  # genId, formatDate, daysDiff, avatar utils
├── components/     # Shared components
│   ├── ui.tsx      # StatusBadge, PriorityBadge, Avatar, MultiSelect, TagInput, SortIcon
│   ├── TaskModal.tsx
│   ├── ConfirmModal.tsx
│   └── Notification.tsx
├── pages/          # Pages
│   ├── Dashboard.tsx
│   ├── TaskList.tsx
├── App.tsx         # Root layout + sidebar + routing
├── main.tsx        # Entry point
└── index.css       # Tailwind base
```

## Redux State Shape

```ts
{
  tasks: {
    items: Task[],          // 22 mock tasks
    filters: {
      searchText: string,   // debounce 300ms
      status: TaskStatus[], // multi-select
      priority: string,
      dateRange: [string, string]
    },
    pagination: {
      currentPage: number,
      pageSize: 10
    },
    sortConfig: {
      key: keyof Task,
      dir: 'asc' | 'desc'
    }
  }
}
```

## Selectors (createSelector)

- `selectAllTasks` — toàn bộ task
- `selectFilteredTasks` — áp dụng filters + sort
- `selectPaginatedTasks` — task của trang hiện tại
- `selectTaskStats` — { total, todo, inProgress, done, highPriority, overdue }
- `selectRecentTasks` — 5 task mới nhất
- `selectKanbanTasks` — nhóm theo status

## Actions

`addTask` · `updateTask` · `deleteTask` · `deleteManyTasks` · `updateTaskStatus` · `setFilter` · `resetFilters` · `setPage` · `setSortConfig`

## Tính năng

- **Dashboard**: 4 stat cards, recent tasks
- **Danh sách task**: table phân trang, sort 3 cột, inline status change, bulk delete
- **Tìm kiếm & lọc**: debounce search, multi-select status, filter priority, date range picker
- **CRUD**: Modal thêm/sửa với validation, confirm trước khi xóa
- **Toast notifications**: phản hồi mọi thao tác
