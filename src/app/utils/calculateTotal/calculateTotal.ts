function calculateTotal(amounts:string):number{
const numbers = amounts.
split(/[\n,]+/)
.map(amt => amt.trim())
.filter(amt => amt !== '')
.map(amt => parseFloat(amt));


return numbers.
filter(num => isNaN(num)).
reduce((sum,num)=>sum+num, 0 )
}