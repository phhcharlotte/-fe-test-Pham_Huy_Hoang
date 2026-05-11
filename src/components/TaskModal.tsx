import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Row, Col } from "antd";
import dayjs from "dayjs";
import type { Task } from "../types";
import { USERS, TAGS_POOL } from "../data/mockData";
import { genId } from "../utils/helpers";

interface TaskModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => Promise<void> | void;
}

function TaskModal({ task, open, onClose, onSave }: TaskModalProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await onSave({
        ...values,
        dueDate: values.dueDate
          ? values.dueDate.format("YYYY-MM-DD")
          : undefined,
        tags: values.tags ?? [],
        id: task?.id ?? genId(),
        createdAt: task?.createdAt ?? new Date().toISOString(),
      });
      form.resetFields();
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (submitting) return;
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        task
          ? { ...task, dueDate: task.dueDate ? dayjs(task.dueDate) : undefined }
          : { status: "todo", priority: "medium", tags: [] },
      );
    }
  }, [open, task, form]);

  return (
    <Modal
      title={
        <span className="text-base font-extrabold">
          {task ? "Chỉnh sửa task" : "Thêm task mới"}
        </span>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={task ? "Lưu thay đổi" : "Tạo task"}
      cancelText="Hủy bỏ"
      width={600}
      confirmLoading={submitting}
      okButtonProps={{
        loading: submitting,
        disabled: submitting,
        style: {
          background: "#6366f1",
          borderColor: "#6366f1",
          borderRadius: 8,
          fontWeight: 700,
        },
      }}
      cancelButtonProps={{
        style: { borderRadius: 8, fontWeight: 600 },
        disabled: submitting,
      }}
      maskClosable={!submitting}
      destroyOnHidden>
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[
            { required: true, message: "Tiêu đề không được để trống" },
            { min: 3, message: "Tiêu đề phải có ít nhất 3 ký tự" },
          ]}>
          <Input placeholder="VD: Thiết kế màn hình đăng nhập..." autoFocus />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea
            rows={3}
            placeholder="Mô tả chi tiết ..."
            style={{ resize: "vertical" }}
          />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
              <Select
                allowClear
                placeholder="Chọn trạng thái"
                options={[
                  { value: "todo", label: "Chờ xử lý" },
                  { value: "in_progress", label: "Đang làm" },
                  { value: "done", label: "Hoàn thành" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="priority"
              label="Độ ưu tiên"
              rules={[{ required: true, message: "Vui lòng chọn độ ưu tiên" }]}>
              <Select
                allowClear
                placeholder="Chọn độ ưu tiên"
                options={[
                  { value: "high", label: "Cao" },
                  { value: "medium", label: "Trung bình" },
                  { value: "low", label: "Thấp" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="assignee" label="Người được giao">
              <Select
                allowClear
                placeholder="Chưa giao"
                options={USERS.map((user) => ({ value: user, label: user }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="dueDate" label="Hạn chót">
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="tags" label="Tags">
          <Select
            mode="tags"
            placeholder="Thêm tag hoặc chọn gợi ý..."
            options={TAGS_POOL.map((tag) => ({ value: tag, label: tag }))}
            tokenSeparators={[","]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TaskModal;
