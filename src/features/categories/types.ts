export type CategoryKind = "INCOME" | "EXPENSE" | "TRANSFER"

export type Category = {
  id: string
  name: string
  kind: CategoryKind
  parent_id?: string | null
  active: boolean
}