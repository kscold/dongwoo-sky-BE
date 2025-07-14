import { 
  registerDecorator, 
  ValidationOptions, 
  ValidatorConstraint, 
  ValidatorConstraintInterface,
  ValidationArguments 
} from 'class-validator';

/**
 * 파일 확장자 유효성 검사
 */
@ValidatorConstraint({ async: false })
export class IsFileExtensionConstraint implements ValidatorConstraintInterface {
  validate(fileName: string, args: ValidationArguments) {
    const [allowedExtensions] = args.constraints;
    if (!fileName || !allowedExtensions) return false;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    return allowedExtensions.includes(extension);
  }

  defaultMessage(args: ValidationArguments) {
    const [allowedExtensions] = args.constraints;
    return `파일 확장자가 유효하지 않습니다. 허용된 확장자: ${allowedExtensions.join(', ')}`;
  }
}

export function IsFileExtension(allowedExtensions: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [allowedExtensions],
      validator: IsFileExtensionConstraint,
    });
  };
}

/**
 * 배열 크기 유효성 검사
 */
@ValidatorConstraint({ async: false })
export class ArraySizeConstraint implements ValidatorConstraintInterface {
  validate(value: any[], args: ValidationArguments) {
    const [min, max] = args.constraints;
    if (!Array.isArray(value)) return false;
    
    return value.length >= min && value.length <= max;
  }

  defaultMessage(args: ValidationArguments) {
    const [min, max] = args.constraints;
    return `배열 크기는 ${min}개 이상 ${max}개 이하여야 합니다.`;
  }
}

export function ArraySize(min: number, max: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [min, max],
      validator: ArraySizeConstraint,
    });
  };
}

/**
 * URL 유효성 검사 (선택적)
 */
@ValidatorConstraint({ async: false })
export class IsOptionalUrlConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return true; // 선택적이므로 빈 값은 유효
    
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage() {
    return '유효한 URL을 입력해주세요.';
  }
}

export function IsOptionalUrl(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsOptionalUrlConstraint,
    });
  };
}

/**
 * 한국어 이름 유효성 검사
 */
@ValidatorConstraint({ async: false })
export class IsKoreanNameConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return false;
    
    // 한글, 영문, 숫자, 공백, 특수문자 (-, .) 허용
    const koreanNameRegex = /^[가-힣a-zA-Z0-9\s\-.]+$/;
    return koreanNameRegex.test(value) && value.trim().length >= 2;
  }

  defaultMessage() {
    return '이름은 2글자 이상의 한글, 영문, 숫자, 공백, -, . 만 사용 가능합니다.';
  }
}

export function IsKoreanName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsKoreanNameConstraint,
    });
  };
}

/**
 * 전화번호 유효성 검사 (한국 형식)
 */
@ValidatorConstraint({ async: false })
export class IsKoreanPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return false;
    
    // 한국 전화번호 형식: 010-1234-5678, 02-123-4567, 031-123-4567 등
    const phoneRegex = /^(01[016789]|02|0[3-9][0-9])-?[0-9]{3,4}-?[0-9]{4}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  }

  defaultMessage() {
    return '유효한 한국 전화번호를 입력해주세요. (예: 010-1234-5678)';
  }
}

export function IsKoreanPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsKoreanPhoneConstraint,
    });
  };
}