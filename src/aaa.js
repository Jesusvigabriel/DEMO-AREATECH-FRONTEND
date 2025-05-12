
const fecha="2022-01-02"
console.log(getSumarDiasFecha(3, new Date(fecha)))


function getSumarDiasFecha (diasASumar, fechaBase)  {
  if (fechaBase==null) {
      fechaBase=new Date()
  }
  fechaBase.setDate(fechaBase.getDate() + diasASumar)
  return dateToString(fechaBase)
}

function dateToString (fecha)  {
  const result=String(fecha.getFullYear())+"-"+String(fecha.getMonth()+1).padStart(2, "0")+"-"+String(fecha.getDate()).padStart(2, "0")
  return result
}



