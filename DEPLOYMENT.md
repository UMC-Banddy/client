# 🚀 배포 가이드

## 📋 목차

1. [환경 설정](#환경-설정)
2. [Vercel 배포](#vercel-배포)
3. [AWS S3 + CloudFront 배포](#aws-s3--cloudfront-배포)
4. [GitHub Actions CI/CD](#github-actions-cicd)
5. [환경별 설정](#환경별-설정)
6. [문제 해결](#문제-해결)

## 🔧 환경 설정

### 1. 필수 도구 설치

```bash
# Node.js 18+ 설치 확인
node --version
npm --version


# Vercel CLI 설치
npm install -g vercel

```

### 2. 환경 변수 설정

#### 로컬 개발

```bash
# .env.local 파일 생성
cp env.production.example .env.local
```

#### 프로덕션

```bash
# .env.production 파일 생성
cp env.production.example .env.production
```

## 🌐 Vercel 배포

### 1. Vercel 프로젝트 생성

```bash
# Vercel 로그인
vercel login

# 프로젝트 초기화
vercel

# 설정 옵션
# - Project name: banddy-client
# - Directory: ./
# - Override settings: No
```

### 2. 환경 변수 설정

Vercel 대시보드에서 환경 변수 설정:

- `VITE_API_BASE_URL`: `https://api.banddy.com`
- `VITE_WS_URL`: `wss://api.banddy.com`

### 3. 수동 배포

```bash
# 개발 환경 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 4. 자동 배포

GitHub 저장소와 연결하면 자동 배포됩니다.

## 🔄 GitHub Actions CI/CD

### 1. GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions에서 설정:

#### 필수 Secrets

```
VITE_API_BASE_URL=https://api.banddy.com
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=banddy-client-production
CLOUDFRONT_DISTRIBUTION_ID=your_cloudfront_distribution_id
DOMAIN_NAME=app.banddy.com
```

### 2. 브랜치 전략

- `main`: 프로덕션 배포 (AWS S3 + CloudFront)
- `develop`: 스테이징 배포 (Vercel)
- `feature/*`: 기능 개발

### 3. 배포 플로우

1. **개발**: `feature/*` 브랜치에서 개발
2. **스테이징**: `develop` 브랜치로 머지 → Vercel 자동 배포
3. **프로덕션**: `main` 브랜치로 머지 → AWS 자동 배포

## 🌍 환경별 설정

### 개발 환경

```bash
npm run dev
# http://localhost:5173
```

### 스테이징 환경

```bash
npm run build:staging
npm run deploy:vercel
# https://banddy-client-staging.vercel.app
```

### 프로덕션 환경

```bash
npm run build:production
npm run deploy:aws:production
# https://app.banddy.com
```

## 🔍 문제 해결

### 1. 빌드 오류

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# TypeScript 오류 확인
npm run type-check

# 린트 오류 확인
npm run lint
```

### 2. 배포 오류

#### Vercel 배포 실패

```bash
# 로컬에서 빌드 테스트
npm run build

# Vercel 로그 확인
vercel logs
```

#### AWS 배포 실패

```bash
# AWS 자격 증명 확인
aws sts get-caller-identity

# S3 버킷 권한 확인
aws s3 ls s3://banddy-client-production

# CloudFront 배포 상태 확인
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

### 3. WebSocket 연결 오류

#### CORS 설정 확인

백엔드에서 WebSocket 엔드포인트 허용:

```javascript
// 백엔드 CORS 설정
app.use(
  cors({
    origin: [
      "https://app.banddy.com",
      "https://banddy-client-staging.vercel.app",
    ],
    credentials: true,
  })
);
```

#### SSL 인증서 확인

```bash
# SSL 인증서 유효성 확인
openssl s_client -connect api.banddy.com:443 -servername api.banddy.com
```

## 📊 모니터링

### 1. 성능 모니터링

- **Vercel Analytics**: Vercel 대시보드에서 확인
- **CloudWatch**: AWS 콘솔에서 확인
- **Google Analytics**: 웹사이트 트래픽 분석

### 2. 오류 모니터링

- **Sentry**: JavaScript 오류 추적
- **LogRocket**: 사용자 세션 재생
- **AWS CloudWatch**: 서버 로그 모니터링

## 🔐 보안

### 1. 환경 변수 보안

- GitHub Secrets 사용
- AWS IAM 최소 권한 원칙
- 환경별 분리된 설정

### 2. HTTPS 강제

- 모든 환경에서 HTTPS 사용
- HSTS 헤더 설정
- 보안 헤더 추가

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. **로그 확인**: GitHub Actions, Vercel, AWS CloudWatch
2. **환경 변수**: 모든 필수 환경 변수 설정 확인
3. **권한 확인**: AWS IAM, GitHub Actions 권한
4. **네트워크**: 방화벽, CORS 설정

---

**마지막 업데이트**: 2024년 12월
