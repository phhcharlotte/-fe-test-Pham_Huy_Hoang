import type { Task } from '../types';

export const USERS = [
  'Nguyễn Văn An',
  'Trần Thị Bích',
  'Lê Văn Cường',
  'Phạm Thị Dung',
  'Hoàng Văn Em',
  'Đỗ Thị Fương',
  'Vũ Minh Giang',
  'Bùi Thị Hoa',
];

export const TAGS_POOL = [
  'frontend','backend','design','api','bug','feature',
  'urgent','refactor','testing','docs','devops','ui',
  'ux','security','mobile','database',
];

export const MOCK_TASKS: Task[] = [
  { id:'t01', title:'Thiết kế UI trang chủ sản phẩm', description:'Xây dựng wireframe, mockup và prototype cho landing page theo Figma design system mới', status:'done', priority:'high', assignee:'Nguyễn Văn An', dueDate:'2025-01-15', createdAt:'2025-01-01T08:00:00Z', tags:['design','ui'] },
  { id:'t02', title:'Tích hợp API thanh toán VNPay & Momo', description:'Kết nối cổng thanh toán, xử lý webhook, refund flow và kiểm thử sandbox', status:'in_progress', priority:'high', assignee:'Trần Thị Bích', dueDate:'2025-02-10', createdAt:'2025-01-03T09:00:00Z', tags:['backend','api'] },
  { id:'t03', title:'Viết unit test cho module đăng nhập', description:'Đảm bảo coverage > 80%, bao gồm edge case OAuth và session management', status:'todo', priority:'medium', assignee:'Lê Văn Cường', dueDate:'2025-02-20', createdAt:'2025-01-05T10:00:00Z', tags:['testing','security'] },
  { id:'t04', title:'Tối ưu hiệu suất truy vấn database', description:'Phân tích slow query log, thêm index, rewrite các câu query N+1', status:'in_progress', priority:'high', assignee:'Phạm Thị Dung', dueDate:'2025-02-05', createdAt:'2025-01-07T11:00:00Z', tags:['backend','database'] },
  { id:'t05', title:'Cập nhật tài liệu Swagger API v2', description:'Cập nhật docs cho 40+ endpoints mới, thêm request/response examples', status:'done', priority:'low', assignee:'Hoàng Văn Em', dueDate:'2025-01-20', createdAt:'2025-01-08T08:30:00Z', tags:['docs','api'] },
  { id:'t06', title:'Fix bug redirect_uri OAuth 2.0', description:'Lỗi redirect_uri_mismatch trên production khi đăng nhập Google, Facebook', status:'done', priority:'high', assignee:'Đỗ Thị Fương', dueDate:'2025-01-12', createdAt:'2025-01-09T09:00:00Z', tags:['bug','security'] },
  { id:'t07', title:'Xây dựng hệ thống thông báo realtime', description:'WebSocket server với Socket.io, push notification qua Firebase FCM', status:'in_progress', priority:'medium', assignee:'Vũ Minh Giang', dueDate:'2025-03-01', createdAt:'2025-01-10T10:00:00Z', tags:['backend','feature'] },
  { id:'t08', title:'Responsive layout toàn bộ ứng dụng', description:'Đảm bảo UI hoạt động tốt trên iOS, Android và màn hình nhỏ', status:'todo', priority:'medium', assignee:'Bùi Thị Hoa', dueDate:'2025-02-28', createdAt:'2025-01-12T08:00:00Z', tags:['frontend','mobile','ux'] },
  { id:'t09', title:'Deploy hạ tầng lên AWS EKS', description:'Setup Kubernetes cluster, Helm charts, auto-scaling cho production', status:'todo', priority:'high', assignee:'Lê Văn Cường', dueDate:'2025-03-15', createdAt:'2025-01-14T09:00:00Z', tags:['devops'] },
  { id:'t10', title:'Refactor thư viện component Button', description:'Tạo design system nhất quán với Storybook documentation', status:'done', priority:'low', assignee:'Phạm Thị Dung', dueDate:'2025-01-25', createdAt:'2025-01-15T10:00:00Z', tags:['frontend','refactor','design'] },
  { id:'t11', title:'Cài đặt Sentry error monitoring', description:'Setup SDK, source maps, alert rules và Slack integration cho bug tracking', status:'in_progress', priority:'medium', assignee:'Hoàng Văn Em', dueDate:'2025-02-15', createdAt:'2025-01-16T11:00:00Z', tags:['devops','backend'] },
  { id:'t12', title:'Viết E2E test với Playwright', description:'Automation test cho luồng checkout, payment và order management', status:'todo', priority:'medium', assignee:'Đỗ Thị Fương', dueDate:'2025-03-20', createdAt:'2025-01-18T08:00:00Z', tags:['testing','frontend'] },
  { id:'t13', title:'Cải thiện Core Web Vitals', description:'Tối ưu LCP < 2.5s, CLS < 0.1, INP < 200ms trên cả mobile và desktop', status:'todo', priority:'high', assignee:'Vũ Minh Giang', dueDate:'2025-02-25', createdAt:'2025-01-19T09:00:00Z', tags:['frontend','ux'] },
  { id:'t14', title:'Xây dựng admin dashboard', description:'CRUD user, order, product với role-based access control cho admin', status:'in_progress', priority:'high', assignee:'Bùi Thị Hoa', dueDate:'2025-03-10', createdAt:'2025-01-20T10:00:00Z', tags:['frontend','backend'] },
  { id:'t15', title:'Cấu hình CI/CD pipeline', description:'GitHub Actions: build, test, lint, deploy lên staging và production', status:'done', priority:'medium', assignee:'Nguyễn Văn An', dueDate:'2025-01-30', createdAt:'2025-01-21T11:00:00Z', tags:['devops'] },
  { id:'t16', title:'Tính năng xuất báo cáo Excel/CSV', description:'Export dữ liệu đơn hàng, user analytics với custom date range filter', status:'todo', priority:'low', assignee:'Trần Thị Bích', dueDate:'2025-03-25', createdAt:'2025-01-22T08:00:00Z', tags:['backend','feature'] },
  { id:'t17', title:'Review & merge 5 PR thiết kế', description:'Code review các PR về design system, icon library và color tokens', status:'done', priority:'medium', assignee:'Lê Văn Cường', dueDate:'2025-01-28', createdAt:'2025-01-23T09:00:00Z', tags:['design'] },
  { id:'t18', title:'Full-text search với Elasticsearch', description:'Tích hợp search engine, indexing pipeline và ranking algorithm', status:'in_progress', priority:'high', assignee:'Phạm Thị Dung', dueDate:'2025-03-05', createdAt:'2025-01-24T10:00:00Z', tags:['backend','feature','database'] },
  { id:'t19', title:'Upgrade React 18 và Next.js 14', description:'Migration guide, breaking changes, test toàn bộ sau upgrade', status:'todo', priority:'low', assignee:'Hoàng Văn Em', dueDate:'2025-04-01', createdAt:'2025-01-25T11:00:00Z', tags:['frontend','refactor'] },
  { id:'t20', title:'Landing page chiến dịch marketing Q2', description:'Thiết kế và develop trang landing page cho campaign mùa hè 2025', status:'todo', priority:'medium', assignee:'Đỗ Thị Fương', dueDate:'2025-04-15', createdAt:'2025-01-26T08:00:00Z', tags:['design','frontend','ux'] },
  { id:'t21', title:'Tối ưu bundle size React app', description:'Code splitting, lazy loading, tree shaking để giảm initial bundle < 200KB', status:'todo', priority:'medium', assignee:'Vũ Minh Giang', dueDate:'2025-03-30', createdAt:'2025-01-27T09:00:00Z', tags:['frontend','refactor'] },
  { id:'t22', title:'Xây dựng hệ thống cache Redis', description:'Cache layer cho API responses, session storage và rate limiting', status:'in_progress', priority:'high', assignee:'Bùi Thị Hoa', dueDate:'2025-02-20', createdAt:'2025-01-28T10:00:00Z', tags:['backend','devops','database'] },
];
