import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../services/category.service"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  })
}

export function useCategoryMutations() {
  const qc = useQueryClient()

  const createMut = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] })
    }
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: any) => updateCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] })
    }
  })

  const deleteMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] })
    }
  })

  return { createMut, updateMut, deleteMut }
}