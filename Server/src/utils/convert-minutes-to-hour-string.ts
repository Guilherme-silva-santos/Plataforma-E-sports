export function convertMinutesToHours(minutesAmount: number){
 const hours = Math.floor(minutesAmount/60);

 const minutes = minutesAmount % 60 // % pega o resto da divisão

 return `${hours} :${minutes}`
}