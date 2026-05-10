import { Modal } from 'antd';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  text: string;
  count?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ open, title, text, count, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      title={<span className="font-extrabold">{title}</span>}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={count ? `Xóa ${count} task` : 'Xóa'}
      cancelText="Hủy"
      okButtonProps={{ danger: true, style: { borderRadius: 8, fontWeight: 700 } }}
      cancelButtonProps={{ style: { borderRadius: 8, fontWeight: 600 } }}
      centered
    >
      <div className="flex flex-col items-center py-4">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-3xl mb-4">🗑️</div>
        <p className="text-gray-500 text-sm text-center leading-relaxed">{text}</p>
      </div>
    </Modal>
  );
}
