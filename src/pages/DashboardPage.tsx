import React from "react";
import { useAppSelector } from "../hooks/redux";
import { Card, Statistic, Alert, Row, Col, Typography } from "antd";
import { selectTaskStats, selectRecentTasks } from "../stores/TaskSlice";
import { StatusBadge, PriorityBadge, Avatar } from "../components/ui";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

function Dashboard() {
  const stats = useAppSelector(selectTaskStats);
  const recents = useAppSelector(selectRecentTasks);
  const { Text } = Typography;
  const statCards = [
    {
      label: "Tổng task",
      value: stats.total,
      suffix: "tasks",
      color: "#6366f1",
      bg: "#ede9fe",
    },
    {
      label: "Chờ xử lý",
      value: stats.todo,
      suffix: "tasks",
      color: "#6b7280",
      bg: "#f3f4f6",
    },
    {
      label: "Đang làm",
      value: stats.inProgress,
      suffix: "tasks",
      color: "#1677ff",
      bg: "#dbeafe",
    },
    {
      label: "Hoàn thành",
      value: stats.done,
      suffix: "tasks",
      color: "#52c41a",
      bg: "#dcfce7",
    },
  ];

  return (
    <div className="space-y-4">
      {stats.overdue > 0 && (
        <Alert
          type="error"
          showIcon
          description={`${stats.overdue} task đã quá hạn! Cần xử lý ngay.`}
          className="rounded-xl"
        />
      )}

      <Row gutter={[14, 14]}>
        {statCards.map((s) => (
          <Col xs={24} sm={12} lg={6} key={s.label}>
            <Card
              className="relative overflow-hidden"
              styles={{ body: { padding: "20px" } }}>
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: s.color }}
              />

              <Statistic
                title={s.label}
                value={s.value}
                style={{ color: s.color, fontSize: 28, fontWeight: 800 }}
              />
              <Text className="text-xs text-gray-400">
                {stats.total
                  ? `${Math.round((s.value / stats.total) * 100)}% tổng số`
                  : "Tất cả trạng thái"}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} lg={12}>
          <Card
            title={<span className="font-bold"> 5 task tạo gần nhất</span>}
            className="h-full">
            <div className="space-y-3">
              {recents.map((recent, index) => {
                return (
                  <div
                    key={recent.id}
                    className={`flex items-start gap-2.5 ${index < recents.length - 1 ? "pb-3 border-b border-gray-50" : ""}`}>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                      style={{
                        background:
                          recent.status === "done"
                            ? "#f6ffed"
                            : recent.status === "in_progress"
                              ? "#e6f4ff"
                              : "#f5f5f5",
                      }}>
                      {recent.status === "done" ? (
                        <CheckCircleOutlined />
                      ) : recent.status === "in_progress" ? (
                        <ReloadOutlined />
                      ) : (
                        <ClockCircleOutlined />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate mb-1">
                        {recent.title}
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <StatusBadge status={recent.status} />
                        <PriorityBadge priority={recent.priority} />
                        {recent.assignee && (
                          <Avatar name={recent.assignee} size={18} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
