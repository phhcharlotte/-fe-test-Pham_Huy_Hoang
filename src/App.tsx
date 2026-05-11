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
  PlusOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { selectTaskStats, addTask } from "./stores/TaskSlice";
import TaskModal from "./components/TaskModal";
import { useNotify } from "./components/Notification";
import { useDarkMode } from "./context/DarkModeContext";
import Dashboard from "./pages/DashboardPage";
import TaskList from "./pages/TaskList";
import type { Task } from "./types";

const { Sider, Header, Content } = Layout;

type Page = "dashboard" | "tasks";

function App() {
  const dispatch = useAppDispatch();
  const { notify } = useNotify();
  const { isDark, toggle: toggleDark } = useDarkMode();

  const [page, setPage] = useState<Page>("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSaveNew = (task: Task) => {
    dispatch(addTask(task));
    setShowAddModal(false);
    notify(" Đã tạo task mới");
  };

  const showAddBtn = page === "tasks";

  const pageTitles: Record<Page, string> = {
    dashboard: " Dashboard",
    tasks: " Danh sách Task",
  };

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    {
      key: "tasks",
      icon: <UnorderedListOutlined />,
      label: (
        <span className="flex items-center justify-between w-full">
          Danh sách Task
        </span>
      ),
    },
  ];

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
          <div className="flex items-center gap-2.5 px-4 py-[18px] border-b border-white/10">
            <div>
              <div className="text-white font-extrabold text-[15px] leading-tight">
                TaskBoard
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="px-2 pt-3">
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[page]}
              onClick={({ key }) => setPage(key as Page)}
              items={menuItems}
              style={{ background: "transparent", border: "none" }}
            />
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

export default App;
