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

const [formOpen,setFormOpen] = useState(true)

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

if(window.innerWidth < 900){
setFormOpen(false)
}

}catch{
toast.error("Error creando deuda")
}

}

async function remove(id:string){

if(!confirm("Eliminar deuda?")) return

await deleteMut.mutateAsync(id)

toast.success("Deuda eliminada")

}

const filtered = debts.filter((d:any)=>{

if(filters.direction && d.direction !== filters.direction) return false

if(filters.search){

const text = `${d.counterparty_name ?? ""} ${d.description ?? ""}`.toLowerCase()

if(!text.includes(filters.search.toLowerCase())) return false

}

return true

})

return(

<div className={styles.page}>

<button
className={styles.mobileToggle}
onClick={()=>setFormOpen(p=>!p)}
>
{formOpen ? "Ocultar formulario" : "Nueva deuda"}
</button>

<div className={styles.grid}>

<Card className={`${styles.formCard} ${!formOpen ? styles.closed : ""}`}>

<form onSubmit={submit} className={styles.form}>

<h2>Nueva deuda</h2>

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

<Button type="submit">
Crear
</Button>

</form>

</Card>


<div>

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


<div className={styles.list}>

<div className={styles.tableHeader}>

<span>Persona</span>
<span>Descripción</span>
<span>Cuotas</span>
<span>Pendiente</span>
<span></span>

</div>

{filtered.map((d:any)=>(

<div key={d.id} className={styles.row}>

<span>{d.counterparty_name}</span>

<span>{d.description || "-"}</span>

<span>
{d.paid_installments} / {d.total_installments}
</span>

<span className={styles.pending}>
${d.pending_amount}
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
onClick={()=>remove(d.id)}
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