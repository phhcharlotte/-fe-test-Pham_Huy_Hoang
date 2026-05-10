import React, { useState } from "react";
import { ConfigProvider, Button, Badge, Layout, Menu, theme } from "antd";
import {
  DashboardOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  PlusOutlined,
  BarsOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { selectTaskStats, addTask } from "./stores/TaskSlice";
import { TaskModal } from "./components/TaskModal";
import { useNotify } from "./components/Notification";
import Dashboard from "./pages/DashboardPage";
import TaskList from "./pages/TaskList";
import type { Task } from "./types";
import "./App.css";

const { Sider, Header, Content } = Layout;

type Page = "dashboard" | "tasks" | "kanban";
type ViewMode = "list" | "kanban";
function App() {
  const dispatch = useAppDispatch();
  const { notify } = useNotify();
  const stats = useAppSelector(selectTaskStats);

  const [page, setPage] = useState<Page>("dashboard");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showAddModal, setShowAddModal] = useState(false);

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

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#6366f1",
          borderRadius: 8,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        components: {
          Table: { headerBg: "#fafafa" },
          Card: { borderRadius: 12 },
          Modal: { borderRadius: 16 },
        },
      }}>
      <Layout style={{ height: "100vh", overflow: "hidden" }}>
        {/* ── Sidebar ── */}
        <Sider
          width={240}
          style={{ background: "#1a1a2e", overflow: "hidden" }}>
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
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.6)",
              }}
            />
          </div>
        </Sider>

        <Layout>
          <Header
            style={{
              background: "#fff",
              borderBottom: "1px solid #f0f0f0",
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
                color: "#111827",
              }}>
              {pageTitles[page]}
            </h1>

            <div className="flex items-center gap-2">
              {page === "tasks" && (
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  {(["list", "kanban"] as ViewMode[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setViewMode(v)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${viewMode === v ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400 hover:text-gray-700"}`}>
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
              background: "#f5f5f5",
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
