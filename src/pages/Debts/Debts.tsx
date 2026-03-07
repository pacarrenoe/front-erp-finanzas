import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import { useDebts } from "../../features/debts/hooks/useDebts"
import { useDebtMutations } from "../../features/debts/hooks/useDebtMutations"

import Card from "../../components/ui/Card/Card"
import Button from "../../components/ui/Button/Button"

import styles from "./Debts.module.css"

export default function Debts(){

  const navigate = useNavigate()

  const { data:debts=[] } = useDebts()

  const { createMut, deleteMut } = useDebtMutations()

  const [form,setForm] = useState({

    direction:"I_OWE" as "I_OWE" | "OWE_ME",
    counterparty_name:"",
    description:"",
    principal_amount:"",
    installments:"1",
    first_due_date:new Date().toISOString().slice(0,10)

  })

  const [filters,setFilters] = useState({

    direction:"",
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

        direction:form.direction,
        counterparty_name:form.counterparty_name,
        description:form.description || undefined,
        principal_amount:Number(form.principal_amount),
        installments:Number(form.installments),
        first_due_date:form.first_due_date

      })

      toast.success("Deuda creada")

      setForm({

        direction:"I_OWE",
        counterparty_name:"",
        description:"",
        principal_amount:"",
        installments:"1",
        first_due_date:new Date().toISOString().slice(0,10)

      })

    }catch{

      toast.error("Error creando deuda")

    }

  }

  async function onDelete(id:string){

    try{

      await deleteMut.mutateAsync(id)

      toast.success("Deuda eliminada")

    }catch{

      toast.error("Error eliminando deuda")

    }

  }

  const filteredDebts = debts.filter((d:any)=>{

    if(filters.direction && d.direction !== filters.direction){
      return false
    }

    if(filters.search){

      const text =
        `${d.counterparty_name ?? ""} ${d.description ?? ""}`
        .toLowerCase()

      if(!text.includes(filters.search.toLowerCase())){
        return false
      }

    }

    return true

  })

  return(

    <div className={styles.page}>

      <div className={styles.grid}>

        <Card>

          <form onSubmit={onSubmit} className={styles.form}>

            <h2>Nueva deuda</h2>

            <select
              value={form.direction}
              onChange={(e)=>onChange("direction",e.target.value)}
            >
              <option value="I_OWE">Yo debo</option>
              <option value="OWE_ME">Me deben</option>
            </select>

            <input
              placeholder="Persona"
              value={form.counterparty_name}
              onChange={(e)=>onChange("counterparty_name",e.target.value)}
              required
            />

            <input
              placeholder="Descripción"
              value={form.description}
              onChange={(e)=>onChange("description",e.target.value)}
            />

            <input
              type="number"
              placeholder="Monto total"
              value={form.principal_amount}
              onChange={(e)=>onChange("principal_amount",e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Número de cuotas"
              value={form.installments}
              min="1"
              onChange={(e)=>onChange("installments",e.target.value)}
            />

            <input
              type="date"
              value={form.first_due_date}
              onChange={(e)=>onChange("first_due_date",e.target.value)}
            />

            <Button type="submit">
              Crear
            </Button>

          </form>

        </Card>

        <div>

          <div className={styles.filters}>

            <select
              value={filters.direction}
              onChange={(e)=>onFilterChange("direction",e.target.value)}
            >
              <option value="">Todos</option>
              <option value="I_OWE">Yo debo</option>
              <option value="OWE_ME">Me deben</option>
            </select>

            <input
              placeholder="Buscar persona..."
              value={filters.search}
              onChange={(e)=>onFilterChange("search",e.target.value)}
            />

          </div>

          <div className={styles.list}>

            <div className={styles.tableHeader}>

              <span>Tipo</span>
              <span>Persona</span>
              <span>Descripción</span>
              <span>Monto</span>
              <span></span>

            </div>

            {filteredDebts.map((d:any)=>(

              <div key={d.id} className={styles.row}>

                <span>
                  {d.direction === "I_OWE" ? "Yo debo" : "Me deben"}
                </span>

                <span>{d.counterparty_name}</span>

                <span>{d.description || "-"}</span>

                <span className={styles.amountNegative}>
                  ${d.principal_amount}
                </span>

                <div className={styles.actions}>

                  <button
                    className={styles.view}
                    onClick={()=>navigate(`/debts/${d.id}`)}
                  >
                    Ver cuotas
                  </button>

                  <button
                    className={styles.delete}
                    onClick={()=>onDelete(d.id)}
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