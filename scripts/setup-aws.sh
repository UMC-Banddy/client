#!/bin/bash

# AWS 리소스 설정 스크립트
# 사용법: ./scripts/setup-aws.sh

set -e

echo "🚀 AWS 리소스 설정을 시작합니다..."

# 환경 변수
PROJECT_NAME="banddy-client"
REGION="ap-northeast-2"
PRODUCTION_BUCKET="${PROJECT_NAME}-production"
STAGING_BUCKET="${PROJECT_NAME}-staging"

echo "📦 S3 버킷 생성 중..."

# 프로덕션 버킷 생성
echo "생성 중: $PRODUCTION_BUCKET"
aws s3 mb s3://$PRODUCTION_BUCKET --region $REGION

# 스테이징 버킷 생성
echo "생성 중: $STAGING_BUCKET"
aws s3 mb s3://$STAGING_BUCKET --region $REGION

# 정적 웹사이트 호스팅 설정
echo "🌐 정적 웹사이트 호스팅 설정 중..."
aws s3 website s3://$PRODUCTION_BUCKET \
  --index-document index.html \
  --error-document index.html

aws s3 website s3://$STAGING_BUCKET \
  --index-document index.html \
  --error-document index.html

# CORS 설정
echo "🔒 CORS 설정 중..."
cat > cors.json << EOF
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": []
    }
  ]
}
EOF

aws s3api put-bucket-cors \
  --bucket $PRODUCTION_BUCKET \
  --cors-configuration file://cors.json

aws s3api put-bucket-cors \
  --bucket $STAGING_BUCKET \
  --cors-configuration file://cors.json

# 버킷 정책 설정 (공개 읽기)
echo "📋 버킷 정책 설정 중..."
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${PRODUCTION_BUCKET}/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket $PRODUCTION_BUCKET \
  --policy file://bucket-policy.json

# CloudFront 배포 생성 안내
echo ""
echo "✅ S3 버킷 설정 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. AWS 콘솔에서 CloudFront 배포 생성"
echo "2. 원본 도메인: $PRODUCTION_BUCKET.s3.$REGION.amazonaws.com"
echo "3. 뷰어 프로토콜 정책: Redirect HTTP to HTTPS"
echo "4. 캐시 정책: CachingOptimized"
echo ""
echo "🔧 배포 스크립트에서 사용할 정보:"
echo "PRODUCTION_BUCKET: $PRODUCTION_BUCKET"
echo "STAGING_BUCKET: $STAGING_BUCKET"
echo "REGION: $REGION"

# 임시 파일 정리
rm -f cors.json bucket-policy.json

echo ""
echo "🎉 AWS 리소스 설정이 완료되었습니다!" 