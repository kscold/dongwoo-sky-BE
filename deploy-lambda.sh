#!/bin/bash

set -e

echo "🚀 Lambda 최적화 배포 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. 현재 디렉토리 확인
if [[ ! -f "package.json" ]] || [[ ! -f "serverless.yml" ]]; then
    print_error "package.json 또는 serverless.yml을 찾을 수 없습니다."
    exit 1
fi

# 2. 백업 생성
print_status "기존 파일 백업 중..."
cp package.json package.json.backup.$(date +%Y%m%d_%H%M%S)
cp serverless.yml serverless.yml.backup.$(date +%Y%m%d_%H%M%S)

# 3. 빌드
print_status "애플리케이션 빌드 중..."
if ! yarn build; then
    print_error "빌드 실패!"
    exit 1
fi
print_success "빌드 완료"

# 4. 프로덕션 dependencies만 설치
print_status "프로덕션 dependencies만 설치 중..."
if ! yarn install --production; then
    print_error "의존성 설치 실패!"
    exit 1
fi

# 5. 최적화된 serverless.yml 생성 (node_modules 포함)
print_status "최적화된 serverless.yml 생성 중..."
cat > serverless.yml.optimized << 'EOF'
service: dongwoo-sky-api

provider:
  name: aws
  runtime: nodejs18.x
  region: ap-northeast-2
  stage: ${opt:stage, 'production'}
  timeout: 30
  memorySize: 1024
  environment:
    MONGODB_URI: ${env:MONGODB_URI}
    NODE_ENV: ${self:provider.stage}
    AWS_S3_BUCKET_NAME: ${env:AWS_S3_BUCKET_NAME}
    AWS_CLOUDFRONT_DOMAIN: ${env:AWS_CLOUDFRONT_DOMAIN}
    JWT_SECRET: ${env:JWT_SECRET, 'your-jwt-secret-key-here'}
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - s3:GetObject
            - s3:PutObject
            - s3:DeleteObject
          Resource: 'arn:aws:s3:::${env:AWS_S3_BUCKET_NAME}/*'
        - Effect: Allow
          Action:
            - s3:ListBucket
          Resource: 'arn:aws:s3:::${env:AWS_S3_BUCKET_NAME}'

functions:
  api:
    handler: dist/lambda.handler
    events:
      - http:
          method: any
          path: /{proxy+}
          cors:
            origin: "*"
            headers:
              - Content-Type
              - Authorization
              - Accept
              - X-Requested-With
              - KakaoAK
            allowCredentials: true

package:
  individually: false
  excludeDevDependencies: false
  patterns:
    - '!src/**'
    - '!test/**'
    - '!coverage/**'
    - '!.git/**'
    - '!.github/**'
    - '!.vscode/**'
    - '!*.md'
    - '!*.log'
    - '!.env*'
    - '!.eslint*'
    - '!.prettier*'
    - '!jest.config*'
    - '!tsconfig*'
    - '!nest-cli.json'
    - '!*.backup.*'
    - '!deploy-*.sh'
    - '!layer/**'
    - '!lambda-layer/**'
    - 'dist/**'
    - 'node_modules/**'
    - 'package.json'
EOF

# 6. 최적화된 설정 파일 적용
print_status "최적화된 설정 파일 적용 중..."
mv serverless.yml serverless.yml.temp
mv serverless.yml.optimized serverless.yml

# 7. Lambda 배포
print_status "AWS Lambda에 배포 중..."
if ! npx serverless deploy --stage production --verbose; then
    print_error "Lambda 배포 실패!"
    # 원본 파일 복구
    mv serverless.yml.temp serverless.yml
    exit 1
fi

# 8. 원본 설정 파일 복구
print_status "원본 설정 파일 복구 중..."
mv serverless.yml.temp serverless.yml

# 9. 전체 dependencies 재설치 (개발 환경 복구)
print_status "개발 환경 복구 중..."
if ! yarn install; then
    print_warning "개발 dependencies 재설치 실패. 수동으로 'yarn install'을 실행해주세요."
fi

# 10. 배포 완료 정보 출력
print_success "🎉 Lambda 배포 완료!"
echo ""
echo "📋 배포 정보:"
echo "  - 스테이지: production"
echo "  - 리전: ap-northeast-2"
echo "  - 함수명: dongwoo-sky-api-production-api"
echo ""
echo "🔗 엔드포인트 URL:"
npx serverless info --stage production | grep "endpoint:" || echo "  엔드포인트 정보를 가져올 수 없습니다."
echo ""
echo "💡 팁:"
echo "  - 로그 확인: npx serverless logs -f api --stage production"
echo "  - 배포 제거: npx serverless remove --stage production"
echo "  - 다시 배포: ./deploy-lambda-fixed.sh"
echo ""
print_success "배포 스크립트 완료!"