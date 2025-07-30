# 🔐 GitHub Secrets 설정 가이드

## 📋 필수 Secrets 목록

GitHub 저장소 → Settings → Secrets and variables → Actions에서 다음 Secrets를 설정해야 합니다.

### **🌐 환경 변수**

| Secret 이름         | 설명          | 예시 값                  |
| ------------------- | ------------- | ------------------------ |
| `VITE_API_BASE_URL` | API 서버 주소 | `https://api.banddy.com` |

### **🚀 Vercel 배포**

| Secret 이름         | 설명               | 설정 방법                                           |
| ------------------- | ------------------ | --------------------------------------------------- |
| `VERCEL_TOKEN`      | Vercel API 토큰    | [Vercel 토큰 생성](#vercel-토큰-생성)               |
| `VERCEL_ORG_ID`     | Vercel 조직 ID     | [Vercel 조직 ID 확인](#vercel-조직-id-확인)         |
| `VERCEL_PROJECT_ID` | Vercel 프로젝트 ID | [Vercel 프로젝트 ID 확인](#vercel-프로젝트-id-확인) |

### **☁️ AWS 배포**

| Secret 이름                  | 설명               | 설정 방법                                     |
| ---------------------------- | ------------------ | --------------------------------------------- |
| `AWS_ACCESS_KEY_ID`          | AWS 액세스 키      | [AWS IAM 사용자 생성](#aws-iam-사용자-생성)   |
| `AWS_SECRET_ACCESS_KEY`      | AWS 시크릿 키      | [AWS IAM 사용자 생성](#aws-iam-사용자-생성)   |
| `AWS_REGION`                 | AWS 리전           | `ap-northeast-2`                              |
| `S3_BUCKET_NAME`             | S3 버킷 이름       | `banddy-client-production`                    |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront 배포 ID | [CloudFront 배포 생성](#cloudfront-배포-생성) |
| `DOMAIN_NAME`                | 도메인 이름        | `app.banddy.com`                              |

## 🔧 설정 방법

### **Vercel 토큰 생성**

1. [Vercel 대시보드](https://vercel.com/account/tokens) 접속
2. "Create Token" 클릭
3. 토큰 이름 입력 (예: `banddy-github-actions`)
4. 토큰 생성 후 복사하여 GitHub Secrets에 저장

### **Vercel 조직 ID 확인**

```bash
# Vercel CLI로 확인
vercel whoami
```

또는 Vercel 대시보드 → Settings → General에서 확인

### **Vercel 프로젝트 ID 확인**

```bash
# Vercel CLI로 확인
vercel ls
```

또는 Vercel 대시보드 → 프로젝트 → Settings → General에서 확인

### **AWS IAM 사용자 생성**

1. AWS 콘솔 → IAM → Users → Create user
2. 사용자 이름: `banddy-github-actions`
3. 권한 정책:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::banddy-client-production",
           "arn:aws:s3:::banddy-client-production/*"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "cloudfront:CreateInvalidation",
           "cloudfront:GetInvalidation",
           "cloudfront:ListInvalidations"
         ],
         "Resource": "arn:aws:cloudfront::*:distribution/*"
       }
     ]
   }
   ```

### **CloudFront 배포 생성**

1. AWS 콘솔 → CloudFront → Create distribution
2. Origin domain: S3 버킷 선택
3. Viewer protocol policy: Redirect HTTP to HTTPS
4. Cache policy: CachingOptimized
5. 배포 생성 후 Distribution ID 복사

## 🚀 배포 플로우

### **브랜치별 배포**

- **`feat/*`**: 코드 품질 검사만 실행
- **`develop`**: Vercel 스테이징 배포
- **`main`**: AWS 프로덕션 배포

### **Pull Request**

- 코드 품질 검사
- 빌드 테스트
- PR 요약 생성

## 📊 모니터링

### **GitHub Actions 대시보드**

- Actions 탭에서 워크플로우 실행 상태 확인
- 각 단계별 로그 확인
- 실패 시 자동 알림

### **배포 상태 확인**

- **Vercel**: https://vercel.com/dashboard
- **AWS**: CloudWatch 로그 및 S3 버킷 상태

## 🔍 문제 해결

### **일반적인 문제들**

1. **Secrets 누락**: 모든 필수 Secrets가 설정되었는지 확인
2. **권한 오류**: AWS IAM 권한 확인
3. **빌드 실패**: 로컬에서 `npm run build` 테스트
4. **배포 실패**: Vercel/AWS 콘솔에서 로그 확인

### **로그 확인**

```bash
# GitHub Actions 로그
# GitHub 저장소 → Actions → 워크플로우 → 실행 → 로그

# Vercel 로그
vercel logs

# AWS 로그
aws logs describe-log-groups
```

---

**마지막 업데이트**: 2024년 12월
