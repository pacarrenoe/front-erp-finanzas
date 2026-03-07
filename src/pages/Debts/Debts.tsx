import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import { useDebts } from "../../features/debts/hooks/useDebts"
import { useDebtMutations } from "../../features/debts/hooks/useDebtMutations"

import styles from "./Debts.module.css"

export default function Debts() {

  const navigate = useNavigate()

  const { data: debts = [] } = useDebts()
  const { createMut, deleteMut } = useDebtMutations()

  const [form, setForm] = useState({
    direction: "I_OWE" as "I_OWE" | "OWE_ME",
    counterparty_name: "",
    description: "",
    principal_amount: "",
    installments: "1",
    first_due_date: new Date().toISOString().slice(0,10)
  })

  const [filters, setFilters] = useState({
    direction: "",
    search: ""
  })

  function change(key:string,value:any){
    setForm(p=>({...p,[key]:value}))
  }

  function changeFilter(key:string,value:string){
    setFilters(p=>({...p,[key]:value}))
  }

  async function submit(e:React.FormEvent){

    e.preventDefault()

    try{

      await createMut.mutateAsync({
        direction: form.direction,
        counterparty_name: form.counterparty_name,
        description: form.description || undefined,
        principal_amount: Number(form.principal_amount),
        installments: Number(form.installments),
        first_due_date: form.first_due_date
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

  async function remove(id:string){

    try{

      await deleteMut.mutateAsync(id)

      toast.success("Deuda eliminada")

    }catch{
      toast.error("Error eliminando deuda")
    }
  }

  const filtered = debts.filter((d:any)=>{

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

  const grouped = filtered.reduce((acc:any,debt:any)=>{

    if(!acc[debt.counterparty_name]){
      acc[debt.counterparty_name] = []
    }

    acc[debt.counterparty_name].push(debt)

    return acc

  },{})

  return(

    <div className={styles.page}>

      <div className={styles.layout}>

        {/* FORM */}

        <div className={styles.formCard}>

          <form onSubmit={submit} className={styles.form}>

            <h3>Nueva deuda</h3>

            <select
              value={form.direction}
              onChange={(e)=>change("direction",e.target.value)}
            >
              <option value="I_OWE">Yo debo</option>
              <option value="OWE_ME">Me deben</option>
            </select>

            <input
              placeholder="Persona"
              value={form.counterparty_name}
              onChange={(e)=>change("counterparty_name",e.target.value)}
              required
            />

            <input
              placeholder="Descripción"
              value={form.description}
              onChange={(e)=>change("description",e.target.value)}
            />

            <input
              type="number"
              placeholder="Monto total"
              value={form.principal_amount}
              onChange={(e)=>change("principal_amount",e.target.value)}
              required
            />

            <input
              type="number"
              min="1"
              placeholder="Cuotas"
              value={form.installments}
              onChange={(e)=>change("installments",e.target.value)}
            />

            <input
              type="date"
              value={form.first_due_date}
              onChange={(e)=>change("first_due_date",e.target.value)}
            />

            <button className={styles.create}>
              Crear
            </button>

          </form>

        </div>

        {/* LIST */}

        <div className={styles.listSection}>

          <div className={styles.filters}>

            <select
              value={filters.direction}
              onChange={(e)=>changeFilter("direction",e.target.value)}
            >
              <option value="">Todos</option>
              <option value="I_OWE">Yo debo</option>
              <option value="OWE_ME">Me deben</option>
            </select>

            <input
              placeholder="Buscar persona..."
              value={filters.search}
              onChange={(e)=>changeFilter("search",e.target.value)}
            />

          </div>

          {Object.entries(grouped).map(([person,items]:any)=>(

            <div key={person} className={styles.group}>

              <div className={styles.groupTitle}>
                {person}
              </div>

              {items.map((d:any)=>(

                <div key={d.id} className={styles.row}>

                  <div className={styles.cell}>
                    {d.description || "-"}
                  </div>

                  <div className={styles.cell}>
                    ${d.principal_amount}
                  </div>

                  <div className={styles.cell}>
                    {d.paid_installments} / {d.total_installments} cuotas
                  </div>

                  <div className={styles.pending}>
                    ${d.pending_amount}
                  </div>

                  <div className={styles.actions}>

                    <button
                      className={styles.view}
                      onClick={()=>navigate(`/debts/${d.id}`)}
                    >
                      Ver cuotas
                    </button>

                    <button
                      className={styles.delete}
                      onClick={()=>remove(d.id)}
                    >
                      Eliminar
                    </button>

                  </div>

                </div>

              ))}

            </div>

          ))}

        </div>

      </div>

    </div>

  )
}