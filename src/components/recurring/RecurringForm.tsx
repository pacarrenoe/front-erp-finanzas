import { useState } from "react"

export default function RecurringForm({onSubmit}:any){

  const [form,setForm] = useState({

    name:"",

    amount:"",

    frequency:"MONTHLY",

    category_id:"",

    account_id:""

  })

  function change(key:string,value:any){

    setForm(p=>({...p,[key]:value}))

  }

  function submit(e:any){

    e.preventDefault()

    onSubmit({

      ...form,

      amount:Number(form.amount)

    })

  }

  return(

  <form onSubmit={submit}>

    <input
      placeholder="Nombre"
      value={form.name}
      onChange={e=>change("name",e.target.value)}
    />

    <input
      placeholder="Monto"
      value={form.amount}
      onChange={e=>change("amount",e.target.value)}
    />

    <select
      value={form.frequency}
      onChange={e=>change("frequency",e.target.value)}
    >

      <option value="MONTHLY">Mensual</option>
      <option value="WEEKLY">Semanal</option>
      <option value="YEARLY">Anual</option>

    </select>

    <button type="submit">

      Crear compromiso

    </button>

  </form>

  )

}