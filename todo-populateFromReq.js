// as-is copied code from 14b. 
//TODO: set this up appropriately for the page
const { data, error } = await db.from('races')
    .select('*')
    .eq('year', year)
    .order('round', { ascending: true });;
if (error) {
    console.error('Error fetching data:', error);
    return;
}
// populate first unordered list
const first = document.querySelector("#first");
for (let d of data) {
    const li = document.createElement("li");
    li.textContent = d.name;
    li.value = d.raceId;
    first.appendChild(li);
}
}