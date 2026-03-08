import { useMemo, useState } from "react"
import toast from "react-hot-toast"

import Card from "../../components/ui/Card/Card"
import Button from "../../components/ui/Button/Button"

import {
  useCategories,
  useCategoryMutations
} from "../../features/categories/hooks/useCategories"

import styles from "./Categories.module.css"

type CategoryKind = "INCOME" | "EXPENSE" | "TRANSFER"

export default function Categories(){

  const { data:categories=[] } = useCategories()

  const { createMut,updateMut,deleteMut } = useCategoryMutations()

  const [editingId,setEditingId] = useState<string|null>(null)

  const [form,setForm] = useState({
    name:"",
    kind:"EXPENSE" as CategoryKind,
    parent_id:""
  })

  const [filters,setFilters] = useState({
    kind:"",
    search:""
  })

  function change(key:string,value:any){
    setForm(p=>({...p,[key]:value}))
  }

  function changeFilter(key:string,value:string){
    setFilters(p=>({...p,[key]:value}))
  }

  function resetForm(){
    setEditingId(null)
    setForm({
      name:"",
      kind:"EXPENSE",
      parent_id:""
    })
  }

  async function submit(e:React.FormEvent){

    e.preventDefault()

    const payload = {
      name:form.name,
      kind:form.kind,
      parent_id:form.parent_id || null
    }

    if(editingId){

      await updateMut.mutateAsync({
        id:editingId,
        data:payload
      })

      toast.success("Categoría actualizada")

    }else{

      await createMut.mutateAsync(payload)

      toast.success("Categoría creada")

    }

    resetForm()

  }

  async function remove(id:string){

    await deleteMut.mutateAsync(id)

    toast.success("Categoría eliminada")

  }

  function edit(category:any){

    setEditingId(category.id)

    setForm({
      name:category.name ?? "",
      kind:category.kind ?? "EXPENSE",
      parent_id:category.parent_id ?? ""
    })

  }

  const parentOptions = useMemo(()=>{
    return categories.filter((c:any)=>c.id !== editingId)
  },[categories,editingId])

  const filteredCategories = categories.filter((c:any)=>{

    if(filters.kind && c.kind !== filters.kind) return false

    if(filters.search){

      const text = `${c.name ?? ""} ${c.parent_name ?? ""}`.toLowerCase()

      if(!text.includes(filters.search.toLowerCase())) return false

    }

    return true

  })

  return(

    <div className={styles.page}>

      <div className={styles.grid}>

        <Card>

          <form onSubmit={submit} className={styles.form}>

            <h2>
              {editingId ? "Editar categoría" : "Nueva categoría"}
            </h2>

            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e)=>change("name",e.target.value)}
              required
            />

            <select
              value={form.kind}
              onChange={(e)=>change("kind",e.target.value)}
            >
              <option value="EXPENSE">Gasto</option>
              <option value="INCOME">Ingreso</option>
              <option value="TRANSFER">Transferencia</option>
            </select>

            <select
              value={form.parent_id}
              onChange={(e)=>change("parent_id",e.target.value)}
            >
              <option value="">
                Sin categoría padre
              </option>

              {parentOptions.map((c:any)=>(
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}

            </select>

            <Button type="submit">
              {editingId ? "Guardar cambios" : "Crear"}
            </Button>

            {editingId && (

              <button
                type="button"
                className={styles.cancel}
                onClick={resetForm}
              >
                Cancelar
              </button>

            )}

          </form>

        </Card>

        <div className={styles.tableWrapper}>

          <div className={styles.filters}>

            <select
              value={filters.kind}
              onChange={(e)=>changeFilter("kind",e.target.value)}
            >
              <option value="">
                Todos los tipos
              </option>

              <option value="EXPENSE">
                Gasto
              </option>

              <option value="INCOME">
                Ingreso
              </option>

              <option value="TRANSFER">
                Transferencia
              </option>

            </select>

            <input
              placeholder="Buscar..."
              value={filters.search}
              onChange={(e)=>changeFilter("search",e.target.value)}
            />

          </div>

          <div className={styles.tableContainer}>

            <div className={styles.tableHeader}>
              <span>Nombre</span>
              <span>Tipo</span>
              <span>Padre</span>
              <span></span>
            </div>

            {filteredCategories.map((c:any)=>(

              <div key={c.id} className={styles.row}>

                <span>{c.name}</span>

                <span>
                  {translateKind(c.kind)}
                </span>

                <span>
                  {c.parent_name ?? "-"}
                </span>

                <div className={styles.rowActions}>

                  <button
                    className={styles.edit}
                    onClick={()=>edit(c)}
                  >
                    Editar
                  </button>

                  <button
                    className={styles.delete}
                    onClick={()=>remove(c.id)}
                  >
                    Eliminar
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )

}

function translateKind(kind:CategoryKind){

  if(kind === "EXPENSE") return "Gasto"

  if(kind === "INCOME") return "Ingreso"

  return "Transferencia"

}