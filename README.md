# MutualBank DApp

MutualBank是一个去中心化的质押挖矿平台，基于以太坊智能合约构建。用户可以通过质押代币获得收益，并参与推荐计划获取额外奖励。

## 功能特点

- 质押挖矿：用户可以质押MBT代币获取收益
- 推荐系统：邀请新用户参与质押可获得额外奖励
- 实时数据：显示质押量、收益率等实时数据
- 安全可靠：使用OpenZeppelin合约库确保安全性
- 现代化UI：采用玻璃态设计风格，提供优质用户体验

## 技术栈

- 前端：React + TypeScript + Styled Components
- 智能合约：Solidity
- Web3：ethers.js
- 开发工具：Hardhat

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/your-username/mutual-bank.git
cd mutual-bank
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑.env文件，填入必要的配置信息
```

4. 启动开发服务器
```bash
npm start
```

## 项目结构

```
mutual-bank/
├── src/
│   ├── components/     # 可复用组件
│   ├── contexts/       # React上下文
│   ├── hooks/          # 自定义Hooks
│   ├── pages/          # 页面组件
│   ├── contracts/      # 智能合约相关
│   ├── types/          # TypeScript类型定义
│   └── config/         # 配置文件
├── public/             # 静态资源
└── contracts/          # Solidity合约
```

## 环境要求

- Node.js >= 14
- npm >= 6
- MetaMask或其他Web3钱包

## 贡献指南

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件 