import { useState } from "react"
import { usePurchases } from "../../features/credit-card-purchases/hooks/usePurchases"
import { useAccounts } from "../../features/accounts/hooks/useAccounts"

import Card from "../../components/ui/Card/Card"
import Button from "../../components/ui/Button/Button"

export default function CreditCardPurchases(){

const { data:purchases=[],createMut,deleteMut } = usePurchases()

const { data:accounts=[] } = useAccounts()

const creditCards = accounts.filter((a:any)=>a.type==="CREDIT_CARD")

const [form,setForm] = useState({

card_account_id:"",
total_amount:"",
installments:"",
first_installment_date:new Date().toISOString().slice(0,10)

})

function onChange(key:string,value:any){

setForm(p=>({...p,[key]:value}))

}

async function submit(e:any){

e.preventDefault()

await createMut.mutateAsync({

card_account_id:form.card_account_id,
total_amount:Number(form.total_amount),
installments:Number(form.installments),
first_installment_date:form.first_installment_date

})

}

async function remove(id:string){

await deleteMut.mutateAsync(id)

}

return(

<div>

<Card>

<form onSubmit={submit}>

<h2>Compra en cuotas</h2>

<select
value={form.card_account_id}
onChange={e=>onChange("card_account_id",e.target.value)}
required
>

<option value="">Tarjeta</option>

{creditCards.map((a:any)=>(

<option key={a.id} value={a.id}>
{a.name}
</option>

))}

</select>

<input
type="number"
placeholder="Monto"
value={form.total_amount}
onChange={e=>onChange("total_amount",e.target.value)}
required
/>

<input
type="number"
placeholder="Cuotas"
value={form.installments}
onChange={e=>onChange("installments",e.target.value)}
required
/>

<Button type="submit">

Crear

</Button>

</form>

</Card>

<div>

{purchases.map((p:any)=>(

<div key={p.id}>

{p.card_name} ••••{p.card_last4}

${p.total_amount}

{p.paid_installments}/{p.total_installments}

<button onClick={()=>remove(p.id)}>
Eliminar
</button>

</div>

))}

</div>

</div>

)

}