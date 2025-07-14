/**
 * 에러 메시지 관련 상수들
 */

// 일반적인 에러 메시지
export const ERROR_MESSAGES = {
  // 엔티티 관련
  ENTITY_NOT_FOUND: (entityName: string, id: string) => 
    `${entityName} with ID "${id}" not found`,
  ENTITY_CREATE_FAILED: (entityName: string) => 
    `${entityName} 생성 중 오류가 발생했습니다.`,
  ENTITY_UPDATE_FAILED: (entityName: string, id: string) => 
    `${entityName} 업데이트 중 오류가 발생했습니다: ${id}`,
  ENTITY_DELETE_FAILED: (entityName: string, id: string) => 
    `${entityName} 삭제 중 오류가 발생했습니다: ${id}`,
  ENTITY_LIST_FAILED: (entityName: string) => 
    `${entityName} 목록을 가져오는 중 오류가 발생했습니다.`,
  ENTITY_TOGGLE_FAILED: (entityName: string, id: string) => 
    `${entityName} 활성화 토글 중 오류가 발생했습니다: ${id}`,

  // 파일 관련
  FILE_NOT_PROVIDED: '파일이 제공되지 않았습니다.',
  FILE_EMPTY: '파일 데이터가 비어있습니다.',
  FILE_INVALID_EXTENSION: (allowedExtensions: string[]) => 
    `허용되지 않은 파일 형식입니다. 허용된 형식: ${allowedExtensions.join(', ')}`,
  FILE_SIZE_EXCEEDED: (maxSize: number) => 
    `파일 크기가 제한을 초과합니다. 최대 ${maxSize / (1024 * 1024)}MB까지 허용됩니다.`,
  FILE_UPLOAD_FAILED: '파일 업로드 중 오류가 발생했습니다.',
  FILE_DELETE_KEY_MISSING: '삭제할 파일 키가 제공되지 않았습니다.',

  // 인증 관련
  UNAUTHORIZED: '인증되지 않은 요청입니다.',
  FORBIDDEN: '권한이 없습니다.',
  INVALID_CREDENTIALS: '잘못된 인증 정보입니다.',

  // 유효성 검사 관련
  VALIDATION_FAILED: '유효성 검사에 실패했습니다.',
  REQUIRED_FIELD_MISSING: (fieldName: string) => 
    `필수 필드가 누락되었습니다: ${fieldName}`,

  // 기타
  INTERNAL_SERVER_ERROR: '서버 내부 오류가 발생했습니다.',
  BAD_REQUEST: '잘못된 요청입니다.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  CREATED: '성공적으로 생성되었습니다.',
  UPDATED: '성공적으로 업데이트되었습니다.',
  DELETED: '성공적으로 삭제되었습니다.',
  UPLOADED: '성공적으로 업로드되었습니다.',
  OPERATION_SUCCESS: '작업이 성공적으로 완료되었습니다.',
} as const;