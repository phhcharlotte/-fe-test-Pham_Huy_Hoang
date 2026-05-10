import React, { useRef, useEffect, useState } from "react";
import { Tag, Select, Avatar as AntAvatar } from "antd";
import type { TaskStatus, TaskPriority } from "../types";
import { avatarInitials, avatarColor } from "../utils/helpers";
import { TAGS_POOL } from "../data/mockData";

const statusMap: Record<TaskStatus, { color: string; label: string }> = {
  todo: { color: "default", label: "Chờ xử lý" },
  in_progress: { color: "processing", label: "Đang làm" },
  done: { color: "success", label: "Hoàn thành" },
};

interface StatusBadgeProps {
  status: TaskStatus;
  editable?: boolean;
  onChange?: (status: TaskStatus) => void;
}

export function StatusBadge({ status, editable, onChange }: StatusBadgeProps) {
  const { color, label } = statusMap[status];
  if (editable) {
    return (
      <Select
        value={status}
        size="small"
        style={{ width: 130 }}
        onClick={(e) => e.stopPropagation()}
        onChange={(val) => onChange?.(val as TaskStatus)}
        options={[
          { value: "todo", label: <Tag color="default">Chờ xử lý</Tag> },
          {
            value: "in_progress",
            label: <Tag color="processing">Đang làm</Tag>,
          },
          { value: "done", label: <Tag color="success">Hoàn thành</Tag> },
        ]}
      />
    );
  }
  return <Tag color={color}>{label}</Tag>;
}

const priorityMap: Record<TaskPriority, { color: string; label: string }> = {
  high: { color: "error", label: "Cao" },
  medium: { color: "warning", label: "Trung bình" },
  low: { color: "success", label: "Thấp" },
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { color, label } = priorityMap[priority];
  return <Tag color={color}>{label}</Tag>;
}

export function Avatar({ name, size = 26 }: { name: string; size?: number }) {
  return (
    <AntAvatar
      size={size}
      style={{
        background: avatarColor(name),
        fontSize: size * 0.38,
        fontWeight: 700,
        flexShrink: 0,
      }}>
      {avatarInitials(name)}
    </AntAvatar>
  );
}

export function TagInput({
  value = [],
  onChange,
}: {
  value?: string[];
  onChange: (tags: string[]) => void;
}) {
  return (
    <div>
      <Select
        mode="tags"
        style={{ width: "100%" }}
        placeholder="Thêm tag, nhấn Enter..."
        value={value}
        onChange={onChange}
        options={TAGS_POOL.map((e) => ({ value: e, label: e }))}
        tokenSeparators={[","]}
      />
      <p className="text-xs text-gray-400 mt-1">
        Nhập tag và nhấn Enter, hoặc chọn từ gợi ý
      </p>
    </div>
  );
}
