import { useParams } from "react-router-dom"
import toast from "react-hot-toast"

import { useDebtSchedule } from "../../features/debts/hooks/useDebtSchedule"
import { useScheduleMutations } from "../../features/debts/hooks/useScheduleMutations"

import styles from "./DebtDetail.module.css"

export default function DebtDetail(){

const { id } = useParams()

const { data:schedule=[],isLoading } = useDebtSchedule(id as string)

const { payMut } = useScheduleMutations()

async function pay(scheduleId:string){

await payMut.mutateAsync(scheduleId)

toast.success("Cuota pagada")

}

if(isLoading){

return <div className={styles.page}>Cargando...</div>

}

return(

<div className={styles.page}>

<h2>Cuotas</h2>

<div className={styles.list}>

<div className={styles.tableHeader}>

<span>Fecha</span>
<span>Monto</span>
<span>Estado</span>
<span></span>

</div>

{schedule.map((s:any)=>(

<div key={s.id} className={styles.row}>

<span>
{new Date(s.due_date).toLocaleDateString()}
</span>

<span>${s.amount}</span>

<span className={
s.status === "PAID"
? styles.paid
: styles.pending
}>
{s.status === "PAID" ? "Pagado" : "Pendiente"}
</span>

{s.status !== "PAID" && (

<button
className={styles.pay}
onClick={()=>pay(s.id)}
>
Marcar pagado
</button>

)}

</div>

))}

</div>

</div>

)

}