#!/bin/bash

# AWS S3 + CloudFront 배포 스크립트
# 사용법: ./scripts/deploy-aws.sh [environment]

set -e

# 환경 변수
ENVIRONMENT=${1:-production}
BUCKET_NAME=""
DISTRIBUTION_ID=""
DOMAIN_NAME=""

# 환경별 설정
if [ "$ENVIRONMENT" = "staging" ]; then
    BUCKET_NAME="banddy-client-staging"
    DISTRIBUTION_ID=""
    DOMAIN_NAME="staging.banddy.com"
elif [ "$ENVIRONMENT" = "production" ]; then
    BUCKET_NAME="banddy-client-production"
    DISTRIBUTION_ID=""
    DOMAIN_NAME="app.banddy.com"
else
    echo "❌ 잘못된 환경입니다. staging 또는 production을 사용하세요."
    exit 1
fi

echo "🚀 $ENVIRONMENT 환경으로 배포를 시작합니다..."

# 1. 빌드
echo "📦 애플리케이션 빌드 중..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 빌드 실패!"
    exit 1
fi

# 2. S3 업로드
echo "☁️ S3에 파일 업로드 중..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete

if [ $? -ne 0 ]; then
    echo "❌ S3 업로드 실패!"
    exit 1
fi

# 3. CloudFront 캐시 무효화
if [ ! -z "$DISTRIBUTION_ID" ]; then
    echo "🔄 CloudFront 캐시 무효화 중..."
    aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*"
    
    if [ $? -ne 0 ]; then
        echo "⚠️ CloudFront 캐시 무효화 실패 (계속 진행)"
    fi
fi

# 4. 배포 완료
echo "✅ 배포 완료!"
echo "🌐 URL: https://$DOMAIN_NAME"
echo "📊 CloudFront 배포 상태 확인 중..."

# 5. CloudFront 배포 상태 확인
if [ ! -z "$DISTRIBUTION_ID" ]; then
    echo "⏳ CloudFront 배포 완료 대기 중..."
    aws cloudfront wait distribution-deployed --id $DISTRIBUTION_ID
    echo "✅ CloudFront 배포 완료!"
fi

echo "🎉 $ENVIRONMENT 환경 배포가 성공적으로 완료되었습니다!" 