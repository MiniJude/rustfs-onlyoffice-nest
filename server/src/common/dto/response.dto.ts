// response.dto.ts
export class ResponseDto<T> {
  code: number;
  message: string;
  data: T | null;
}
