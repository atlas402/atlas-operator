# Atlas Operator

> AI-powered control plane SDK for x402 ecosystem

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![x402](https://img.shields.io/badge/x402-Compatible-green)](https://x402.org)

Atlas Operator provides AI-powered service discovery, workflow execution, and payment intent generation for x402 services.

## Installation

### TypeScript/JavaScript

```bash
npm install @atlas402/operator
```

### Python

```bash
pip install atlas-operator
```

### Go

```bash
go get github.com/atlas402/operator
```

### Java

```xml
<dependency>
  <groupId>com.atlas402</groupId>
  <artifactId>operator</artifactId>
  <version>1.0.0</version>
</dependency>
```

## Quick Start

### TypeScript

```typescript
import { AtlasOperator } from '@atlas402/operator';

const operator = new AtlasOperator({
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  facilitatorUrl: 'https://facilitator.payai.network',
});

const response = await operator.chat({
  message: 'Find AI services',
  context: { network: 'base', budget: '10.00' },
});
```

## License

Apache 2.0


