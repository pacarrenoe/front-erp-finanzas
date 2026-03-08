import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4"
]

function formatMoney(value:number){
  return new Intl.NumberFormat("es-CL",{
    style:"currency",
    currency:"CLP",
    maximumFractionDigits:0
  }).format(value)
}

type Category = {
  category_name:string
  total:number
}

export default function CategoryPieChart({
  data
}:{data:Category[]}){

  return(

    <ResponsiveContainer width="100%" height={260}>

      <PieChart>

        <Pie
          data={data}
          dataKey="total"
          nameKey="category_name"
          outerRadius={90}
          label
        >

          {data.map((_,index)=>(
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}

        </Pie>

        <Tooltip formatter={(value) => formatMoney(Number(value))} />

      </PieChart>

    </ResponsiveContainer>

  )
}