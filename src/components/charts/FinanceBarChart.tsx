import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

function formatMoney(value:number){
  return new Intl.NumberFormat("es-CL",{
    style:"currency",
    currency:"CLP",
    maximumFractionDigits:0
  }).format(value)
}

type Props = {
  income:number
  expense:number
  commitments:number
}

export default function FinanceBarChart({
  income,
  expense,
  commitments
}:Props){

  const data = [
    { name:"Ingreso", value:income },
    { name:"Gasto", value:expense },
    { name:"Compromisos", value:commitments }
  ]

  return(

    <ResponsiveContainer width="100%" height={260}>

      <BarChart data={data}>

        <XAxis dataKey="name" />

        <YAxis tickFormatter={(v)=>`${v/1000}k`} />

        <Tooltip formatter={(value) => formatMoney(Number(value))} />

        <Bar
          dataKey="value"
          radius={[6,6,0,0]}
          fill="#3b82f6"
        />

      </BarChart>

    </ResponsiveContainer>

  )
}