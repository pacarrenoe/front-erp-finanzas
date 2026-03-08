export type ProjectionPeriod = {

  index: number

  start_date: string
  end_date: string

  expected_income: number
  expected_commitments: number
  projected_balance: number

  commitment_ratio: number
  debt_ratio: number

  risk_level:
    | "BAJO"
    | "MEDIO"
    | "ALTO"
    | "CRITICO"

}