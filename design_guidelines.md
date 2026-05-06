# 公司智能助手小程序设计指南

## 1. 品牌定位

**产品定位**：企业内部智能助手小程序
**设计风格**：商务稳重（Trust & Professional）
**目标用户**：公司内部员工
**核心价值**：高效、智能、可靠的办公助手

## 2. 配色方案

### 品牌色
| 变量 | 色值 | 用途 |
|------|------|------|
| `--color-primary` | `#1E40AF` | 主色调，按钮、重要元素 |
| `--color-primary-container` | `#DBEAFE` | 次级背景，如图标底色 |
| `--color-on-primary` | `#ffffff` | 主色上的文字 |

### 背景/表面色
| 变量 | 色值 | 用途 |
|------|------|------|
| `--color-background` | `#FAFCFF` | 页面背景，微蓝白底 |
| `--color-surface` | `#FFFFFF` | 卡片背景 |
| `--color-surface-container` | `#F1F5F9` | 输入框、搜索框背景 |
| `--color-surface-container-high` | `#E2E8F0` | 按压状态 |

### 文字色
| 变量 | 色值 | 用途 |
|------|------|------|
| `--color-on-surface` | `#1E293B` | 主要文字 |
| `--color-on-surface-variant` | `#64748B` | 次要文字、辅助信息 |

### 功能色
| 变量 | 色值 | 用途 |
|------|------|------|
| `--color-success` | `#22c55e` | 成功、完成状态 |
| `--color-error` | `#ef4444` | 错误、警告 |
| `--color-warning` | `#f59e0b` | 注意、提示 |

## 3. 圆角系统

| 变量 | 值 | 用途 |
|------|------|------|
| `--radius-sm` | 6px | 小按钮、小标签 |
| `--radius-md` | 8px | 小组件 |
| `--radius-lg` | 12px | 卡片、面板 |
| `--radius-xl` | 16px | 大卡片、弹窗 |
| `--radius-2xl` | 24px | 输入框、特殊容器 |
| `--radius-full` | 9999px | 圆形元素 |

## 4. 阴影系统

| 变量 | 值 | 用途 |
|------|------|------|
| `--shadow-card` | `0 4px 12px rgba(0,0,0,0.08)` | 卡片阴影 |
| `--shadow-float` | `0 10px 25px rgba(0,0,0,0.12)` | 浮层阴影 |
| `--shadow-dialog` | `0 25px 50px rgba(0,0,0,0.15)` | 弹窗阴影 |

## 5. 字体规范

**全局字体**：`Noto Sans SC`, system-ui, sans-serif

### 文字层级
| 层级 | 样式 | 颜色 | 用途 |
|------|------|------|------|
| L1 | `text-xl font-bold` | `text-on-surface` | 页面大标题 |
| L2 | `text-base font-semibold` | `text-on-surface` | 卡片标题 |
| L3 | `text-sm font-normal` | `text-on-surface` | 正文 |
| L4 | `text-xs font-normal` | `text-on-surface-variant` | 时间戳、辅助 |

## 6. 组件使用原则

### 通用组件优先
所有通用 UI 组件（按钮、输入框、卡片、图标等）必须优先使用 `@/components/ui/*` 组件库，**禁止**用 `View/Text` 手搓。

### 组件选型
| 场景 | 推荐组件 |
|------|---------|
| 主按钮 | `Button` |
| 输入框 | `Input` / `Textarea` |
| 卡片 | `Card` |
| 消息气泡 | 自定义组件 |
| 图标 | `lucide-react-taro` |

## 7. 页面结构

### TabBar 页面（3个）
1. **助手（首页）** - `pages/index/index`
2. **历史** - `pages/history/index`
3. **我的** - `pages/profile/index`

### 二级页面
- **对话详情** - `pages/chat/index`

## 8. 布局规范

### TabBar 配置
```typescript
tabBar: {
  color: '#64748B',
  selectedColor: '#1E40AF',
  backgroundColor: '#FFFFFF',
  list: [
    { pagePath: 'pages/index/index', text: '助手', iconPath, selectedIconPath },
    { pagePath: 'pages/history/index', text: '历史', iconPath, selectedIconPath },
    { pagePath: 'pages/profile/index', text: '我的', iconPath, selectedIconPath },
  ]
}
```

### 安全区域
- 底部 TabBar：`pb-[calc(3.5rem+env(safe-area-inset-bottom))]`
- iPhone 底部安全区域自动适配

## 9. 交互规范

### 点击反馈
- 按钮：添加 `hover:bg-primary/90 active:bg-primary/80`
- 卡片：添加 `hover:bg-surface-container transition-colors`

### 最小点击区域
- 最小点击区域：`48×48px`

## 10. 智能体集成

### 待接入
- **Bot ID**：待配置
- **API Token**：待配置

### 功能清单
- [ ] 智能对话
- [ ] 流式输出
- [ ] 历史记录
- [ ] 收藏功能
- [ ] 快捷入口
