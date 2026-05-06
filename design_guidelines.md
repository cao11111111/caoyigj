# 公司智能助手小程序设计指南

## 1. 品牌定位

**产品定位**：企业内部智能助手小程序
**设计风格**：现代精致（Modern Elegant）
**目标用户**：公司内部员工
**核心价值**：高效、智能、温情的办公助手

## 2. 配色方案

### 品牌色 - 渐变蓝紫
| 变量 | 色值 | 用途 |
|------|------|------|
| `--color-primary` | `#6366f1` | 主色调（靛蓝） |
| `--color-primary-light` | `#818cf8` | 浅色主色 |
| `--color-primary-container` | `#eef2ff` | 次级背景 |
| `--color-secondary` | `#8b5cf6` | 次要强调（紫色） |
| `--color-secondary-container` | `#f5f3ff` | 次要背景 |

### 渐变背景
| 变量 | 色值 | 用途 |
|------|------|------|
| `--gradient-primary` | `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)` | 主渐变 |
| `--gradient-bg` | `linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)` | 页面背景 |
| `--gradient-card` | `linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)` | 毛玻璃卡片 |

### 背景/表面色
| 变量 | 色值 | 用途 |
|------|------|------|
| `--color-background` | `#f8fafc` | 页面背景 |
| `--color-surface` | `#ffffff` | 卡片背景 |
| `--color-surface-elevated` | `rgba(255,255,255,0.8)` | 浮层背景 |

### 文字色
| 变量 | 色值 | 用途 |
|------|------|------|
| `--color-on-surface` | `#1e293b` | 主要文字 |
| `--color-on-surface-variant` | `#64748b` | 次要文字 |
| `--color-on-primary` | `#ffffff` | 主色上的文字 |

### 功能色
| 变量 | 色值 | 用途 |
|------|------|------|
| `--color-success` | `#22c55e` | 成功状态 |
| `--color-error` | `#ef4444` | 错误状态 |
| `--color-warning` | `#f59e0b` | 警告状态 |

## 3. 圆角系统

| 变量 | 值 | 用途 |
|------|------|------|
| `--radius-sm` | 8px | 小按钮、标签 |
| `--radius-md` | 12px | 小组件 |
| `--radius-lg` | 16px | 卡片 |
| `--radius-xl` | 20px | 大卡片 |
| `--radius-2xl` | 24px | 输入框 |
| `--radius-full` | 9999px | 圆形元素 |

## 4. 阴影系统

| 变量 | 值 | 用途 |
|------|------|------|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.04)` | 轻阴影 |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.06)` | 中阴影 |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.08)` | 大阴影 |
| `--shadow-glow` | `0 4px 24px rgba(99,102,241,0.25)` | 发光阴影 |

## 5. 字体规范

**全局字体**：Noto Sans SC, system-ui, sans-serif

### 文字层级
| 层级 | 样式 | 颜色 | 用途 |
|------|------|------|------|
| L1 | `text-2xl font-bold` | `text-on-surface` | 页面大标题 |
| L2 | `text-lg font-semibold` | `text-on-surface` | 卡片标题 |
| L3 | `text-base font-medium` | `text-on-surface` | 正文 |
| L4 | `text-sm font-normal` | `text-on-surface-variant` | 辅助文字 |

## 6. 组件使用原则

### 通用组件优先
所有通用 UI 组件必须优先使用 `@/components/ui/*` 组件库。

### 组件选型
| 场景 | 推荐组件 |
|------|---------|
| 主按钮 | `Button` |
| 输入框 | `Input` / `Textarea` |
| 卡片 | 自定义（毛玻璃风格） |
| 消息气泡 | 自定义组件 |
| 图标 | `lucide-react-taro` |

## 7. 页面结构

### TabBar 页面（3个）
1. **助手** - `pages/index/index`（首页对话入口）
2. **历史** - `pages/history/index`
3. **我的** - `pages/profile/index`

### 二级页面
- **对话详情** - `pages/chat/index`

## 8. 视觉特点

### 渐变头部
首页顶部使用渐变色块，配合毛玻璃用户卡片

### 毛玻璃卡片
所有卡片使用半透明白色背景 + 微妙阴影
`backdrop-blur: 12px`

### 柔和图标
图标使用渐变色或柔和的单色

### 精致间距
页面边距 16px，卡片间距 12px，组件内边距 16-20px
