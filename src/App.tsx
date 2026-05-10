import React, { useState } from "react";
import {
  ConfigProvider,
  Button,
  Badge,
  Layout,
  Menu,
  theme,
  Tooltip,
  Switch,
} from "antd";
import {
  DashboardOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  PlusOutlined,
  BarsOutlined,
  TableOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { selectTaskStats, addTask } from "./stores/TaskSlice";
import { TaskModal } from "./components/TaskModal";
import { useNotify } from "./components/Notification";
import { useDarkMode } from "./context/DarkModeContext";
import { useUrlFilters } from "./hooks/useUrlFilters";
import Dashboard from "./pages/DashboardPage";
import TaskList from "./pages/TaskList";
import type { Task } from "./types";

const { Sider, Header, Content } = Layout;

type Page = "dashboard" | "tasks" | "kanban";
type ViewMode = "list" | "kanban";

export default function App() {
  const dispatch = useAppDispatch();
  const { notify } = useNotify();
  const { isDark, toggle: toggleDark } = useDarkMode();
  const stats = useAppSelector(selectTaskStats);

  const [page, setPage] = useState<Page>("dashboard");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showAddModal, setShowAddModal] = useState(false);

  // Persist filters vào URL query params (2 chiều)
  useUrlFilters();

  const handleSaveNew = (task: Task) => {
    dispatch(addTask(task));
    setShowAddModal(false);
    notify("✨ Đã tạo task mới");
  };

  const showAddBtn = page === "tasks" || page === "kanban";

  const pageTitles: Record<Page, string> = {
    dashboard: "📊 Dashboard",
    tasks: "📋 Danh sách Task",
    kanban: "🗂️ Kanban Board",
  };

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    {
      key: "tasks",
      icon: <UnorderedListOutlined />,
      label: (
        <span className="flex items-center justify-between w-full">
          Danh sách Task
          <Badge
            count={stats.total}
            color="#6366f1"
            size="small"
            style={{ marginLeft: 6 }}
          />
        </span>
      ),
    },
  ];

  // Màu nền sidebar và content theo dark mode
  const sidebarBg = isDark ? "#0f1117" : "#1a1a2e";
  const contentBg = isDark ? "#13151f" : "#f5f5f5";
  const headerBg = isDark ? "#1e2130" : "#ffffff";
  const headerBorder = isDark ? "#2d3148" : "#f0f0f0";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#6366f1",
          borderRadius: 8,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          ...(isDark
            ? {
                colorBgContainer: "#1e2130",
                colorBgElevated: "#252840",
                colorBorder: "#2d3148",
                colorText: "#e5e7eb",
                colorTextSecondary: "#9ca3af",
              }
            : {}),
        },
        components: {
          Table: { headerBg: isDark ? "#161827" : "#fafafa" },
          Card: { borderRadius: 12 },
          Modal: { borderRadius: 16 },
          Layout: { siderBg: sidebarBg, headerBg },
          Menu: {
            darkItemBg: "transparent",
            darkSubMenuItemBg: "transparent",
            itemBorderRadius: 8,
          },
        },
      }}>
      <Layout style={{ height: "100vh", overflow: "hidden" }}>
        {/* ── Sidebar ── */}
        <Sider
          width={240}
          style={{
            background: sidebarBg,
            overflow: "hidden",
            position: "relative",
          }}>
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-4 py-[18px] border-b border-white/10">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-base">
              T
            </div>
            <div>
              <div className="text-white font-extrabold text-[15px] leading-tight">
                TaskBoard
              </div>
              <div className="text-white/30 text-[9px] font-semibold tracking-widest uppercase">
                v2.0 Pro
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="px-2 pt-3">
            <div className="text-[10px] font-bold text-white/25 uppercase tracking-[1.2px] px-3 mb-1">
              Menu chính
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[page]}
              onClick={({ key }) => setPage(key as Page)}
              items={menuItems}
              style={{ background: "transparent", border: "none" }}
            />
          </div>

          {/* Mini stats */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-white/10">
            <div className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2">
              Thống kê nhanh
            </div>
            {(
              [
                ["⏳ Chờ xử lý", stats.todo, "#e5e7eb"],
                ["🔄 Đang làm", stats.inProgress, "#93c5fd"],
                ["✅ Hoàn thành", stats.done, "#86efac"],
                ...(stats.overdue > 0
                  ? [["⚠️ Quá hạn", stats.overdue, "#fca5a5"]]
                  : []),
              ] as [string, number, string][]
            ).map(([label, value, color]) => (
              <div
                key={label}
                className="flex justify-between items-center text-xs text-white/50 mb-1.5">
                <span>{label}</span>
                <span className="font-bold" style={{ color }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Sider>

        {/* ── Main ── */}
        <Layout style={{ background: contentBg }}>
          {/* Topbar */}
          <Header
            style={{
              background: headerBg,
              borderBottom: `1px solid ${headerBorder}`,
              padding: "0 24px",
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <h1
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 800,
                color: isDark ? "#f3f4f6" : "#111827",
              }}>
              {pageTitles[page]}
            </h1>

            <div className="flex items-center gap-2">
              {/* View toggle (List / Kanban) */}
              {page === "tasks" && (
                <div
                  className="flex gap-1 rounded-lg p-1"
                  style={{ background: isDark ? "#252840" : "#f3f4f6" }}>
                  {(["list", "kanban"] as ViewMode[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setViewMode(v)}
                      style={{
                        background:
                          viewMode === v
                            ? isDark
                              ? "#3d4266"
                              : "#ffffff"
                            : "transparent",
                        color:
                          viewMode === v
                            ? "#6366f1"
                            : isDark
                              ? "#9ca3af"
                              : "#9ca3af",
                        boxShadow:
                          viewMode === v
                            ? "0 1px 3px rgba(0,0,0,0.15)"
                            : "none",
                      }}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1">
                      {v === "list" ? (
                        <>
                          <BarsOutlined /> List
                        </>
                      ) : (
                        <>
                          <TableOutlined /> Kanban
                        </>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Dark mode toggle */}
              <Tooltip
                title={
                  isDark ? "Chuyển sang Light mode" : "Chuyển sang Dark mode"
                }>
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: isDark ? "#252840" : "#f3f4f6",
                    border: `1px solid ${isDark ? "#3d4266" : "#e5e7eb"}`,
                  }}
                  onClick={toggleDark}>
                  {isDark ? (
                    <SunOutlined style={{ color: "#facc15", fontSize: 14 }} />
                  ) : (
                    <MoonOutlined style={{ color: "#6366f1", fontSize: 14 }} />
                  )}
                  <Switch
                    size="small"
                    checked={isDark}
                    onChange={toggleDark}
                    style={{ background: isDark ? "#6366f1" : "#d1d5db" }}
                    onClick={(_, e) => e.stopPropagation()}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: isDark ? "#d1d5db" : "#6b7280",
                    }}>
                    {isDark ? "Dark" : "Light"}
                  </span>
                </div>
              </Tooltip>

              {/* Add task button */}
              {showAddBtn && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setShowAddModal(true)}
                  style={{ fontWeight: 700 }}>
                  Thêm task
                </Button>
              )}
            </div>
          </Header>

          {/* Page content */}
          <Content
            style={{
              overflow: "auto",
              padding: "20px 24px",
              background: contentBg,
            }}>
            {page === "dashboard" && <Dashboard />}
            {page === "tasks" && <TaskList />}
          </Content>
        </Layout>
      </Layout>

      {showAddModal && (
        <TaskModal
          task={null}
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveNew}
        />
      )}
    </ConfigProvider>
  );
}
