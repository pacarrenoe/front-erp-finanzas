import { useState } from "react"
import { useRecurring } from "../../features/recurring/hooks/useRecurring"
import { useAccounts } from "../../features/accounts/hooks/useAccounts"
import { useCategories } from "../../features/categories/hooks/useCategories"
import toast from "react-hot-toast"

import Card from "../../components/ui/Card/Card"
import Button from "../../components/ui/Button/Button"

import styles from "./Recurring.module.css"

export default function Recurring(){

  const { data: recurring = [], createMut, deleteMut, toggleMut } = useRecurring()

  const { data: accounts = [] } = useAccounts()
  const { data: categories = [] } = useCategories()

  const [formOpen,setFormOpen] = useState(true)

  const [form,setForm] = useState({

    name:"",
    amount:"",
    frequency:"MONTHLY",
    account_id:"",
    category_id:"",
    start_date:new Date().toISOString().slice(0,10)

  })

  const [filters,setFilters] = useState({

    category:"",
    search:""

  })

  function onChange(key:string,value:any){

    setForm(p=>({...p,[key]:value}))

  }

  function onFilterChange(key:string,value:string){

    setFilters(p=>({...p,[key]:value}))

  }

  async function onSubmit(e:React.FormEvent){

    e.preventDefault()

    try{

      await createMut.mutateAsync({

        name:form.name,
        amount:Number(form.amount),
        frequency:form.frequency,
        account_id:form.account_id,
        category_id:form.category_id,
        start_date:form.start_date

      })

      toast.success("Compromiso creado")

      setForm({

        name:"",
        amount:"",
        frequency:"MONTHLY",
        account_id:"",
        category_id:"",
        start_date:new Date().toISOString().slice(0,10)

      })

      if(window.innerWidth < 900){

        setFormOpen(false)

      }

    }catch{

      toast.error("Error creando compromiso")

    }

  }

  async function onDelete(id:string){

    try{

      await deleteMut.mutateAsync(id)

      toast.success("Compromiso eliminado")

    }catch{

      toast.error("Error eliminando")

    }

  }

  async function onToggle(id:string){

    try{

      await toggleMut.mutateAsync(id)

      toast.success("Estado actualizado")

    }catch{

      toast.error("Error actualizando")

    }

  }

  const filtered = recurring.filter((r:any)=>{

    if(filters.category && r.category_id !== filters.category) return false

    if(filters.search){

      const text = `${r.name ?? ""}`.toLowerCase()

      if(!text.includes(filters.search.toLowerCase())) return false

    }

    return true

  })

  return(

  <div className={styles.page}>

    <button
      type="button"
      className={styles.mobileToggle}
      onClick={()=>setFormOpen(p=>!p)}
    >
      {formOpen ? "Ocultar formulario" : "Nuevo compromiso"}
    </button>

    <div className={styles.grid}>

      <Card className={`${styles.formCard} ${!formOpen ? styles.closed : ""}`}>

        <form onSubmit={onSubmit} className={styles.form}>

          <h2>Nuevo compromiso</h2>

          <input
            placeholder="Nombre (ej: Arriendo)"
            value={form.name}
            onChange={e=>onChange("name",e.target.value)}
            required
          />

          <select
            value={form.account_id}
            onChange={e=>onChange("account_id",e.target.value)}
            required
          >
            <option value="">Cuenta</option>

            {accounts.map((a:any)=>(

              <option key={a.id} value={a.id}>
                {a.name}
              </option>

            ))}

          </select>

          <select
            value={form.category_id}
            onChange={e=>onChange("category_id",e.target.value)}
            required
          >
            <option value="">Categoría</option>

            {categories.map((c:any)=>(

              <option key={c.id} value={c.id}>
                {c.name}
              </option>

            ))}

          </select>

          <select
            value={form.frequency}
            onChange={e=>onChange("frequency",e.target.value)}
          >
            <option value="MONTHLY">Mensual</option>
            <option value="WEEKLY">Semanal</option>
            <option value="YEARLY">Anual</option>
          </select>

          <input
            type="number"
            placeholder="Monto"
            value={form.amount}
            onChange={e=>onChange("amount",e.target.value)}
            required
          />

          <input
            type="date"
            value={form.start_date}
            onChange={e=>onChange("start_date",e.target.value)}
          />

          <Button type="submit">
            Crear
          </Button>

        </form>

      </Card>

      <div>

        <div className={styles.filters}>

          <select
            value={filters.category}
            onChange={e=>onFilterChange("category",e.target.value)}
          >
            <option value="">Todas las categorías</option>

            {categories.map((c:any)=>(

              <option key={c.id} value={c.id}>
                {c.name}
              </option>

            ))}

          </select>

          <input
            placeholder="Buscar..."
            value={filters.search}
            onChange={e=>onFilterChange("search",e.target.value)}
          />

        </div>

        <div className={styles.list}>

          <div className={styles.tableHeader}>

            <span>Nombre</span>
            <span>Cuenta</span>
            <span>Categoría</span>
            <span>Frecuencia</span>
            <span>Monto</span>
            <span>Estado</span>
            <span></span>

          </div>

          {filtered.map((r:any)=>(

            <div key={r.id} className={styles.row}>

              <span>{r.name}</span>

              <span>{r.account_name}</span>

              <span>{r.category_name}</span>

              <span>{r.frequency}</span>

              <span className={styles.amountNegative}>
                -${r.amount}
              </span>

              <button
                className={styles.toggle}
                onClick={()=>onToggle(r.id)}
              >
                {r.active ? "Activo" : "Inactivo"}
              </button>

              <button
                className={styles.delete}
                onClick={()=>onDelete(r.id)}
              >
                Eliminar
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>

  </div>

  )

}