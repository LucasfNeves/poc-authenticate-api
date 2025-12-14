export interface RegisterRequestBody {
  email: string
  name: string
  password: string
  telephones: Array<{
    number: number | string
    area_code: number | string
  }>
}
