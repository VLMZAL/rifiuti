let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function convertDay(jsDay) {
    return (jsDay + 6) % 7;
}

async function loadCalendar() {
    const response = await fetch("calendar.json");
    const data = await response.json();

    const calendar = data.calendar;
    const fridayRules = data.fridayRules;

    renderCalendar(calendar, fridayRules);
}

function renderCalendar(calendar, fridayRules) {
    const monthYear = document.getElementById("month-year");
    const daysContainer = document.getElementById("days");

    const date = new Date(currentYear, currentMonth, 1);

    const firstDay = convertDay(date.getDay());

    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

    monthYear.textContent = date.toLocaleString("it-IT", { month: "long", year: "numeric" });
    daysContainer.innerHTML = "";

    let dayCount = 1;

    for (let i = 0; i < 42; i++) {
        const cell = document.createElement("div");
        cell.classList.add("day");

        if (i >= firstDay && dayCount <= lastDay) {

            const dayNumber = dayCount;

            const jsDay = new Date(currentYear, currentMonth, dayNumber).getDay();
            const dayOfWeek = convertDay(jsDay);

            let waste = calendar[dayOfWeek];

            if (dayOfWeek === 4) {
                const fridayNumber = Math.ceil(dayNumber / 7);
                waste = fridayRules[fridayNumber - 1];
            }

            let cssClass = "";
            if (waste.includes("Organico")) cssClass = "organico";
            else if (waste.includes("Secco")) cssClass = "secco";
            else if (waste.includes("Plastica")) cssClass = "plastica";
            else if (waste.includes("Carta")) cssClass = "carta";
            else if (waste.includes("Vetro")) cssClass = "vetro";
            else cssClass = "nessuno";

            cell.innerHTML = `
                <div class="day-number">${dayNumber}</div>
                <a href="categorie.html#${cssClass}" 
                   class="badge ${cssClass}" 
                   style="margin-top:6px; padding:4px; border-radius:4px; display:inline-block;">
                    ${waste}
                </a>
            `;
            
            dayCount++;
        }

        daysContainer.appendChild(cell);
    }
}

document.getElementById("prev").onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    loadCalendar();
};

document.getElementById("next").onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadCalendar();
};

loadCalendar();
