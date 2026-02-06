const caseOptions = [
    { name: "VIP на 1 день", img: "https://i.ibb.co/2sN3Q3F/vip.png" },
    { name: "Скін наклейка", img: "https://i.ibb.co/Xy7Gd2f/sticker.png" },
    { name: "Скін CS2", img: "https://i.ibb.co/pwL7k3k/skin.png" }
];

async function openCase() {
    const name = document.getElementById("playerName").value;
    if (!name) { alert("Введи нік"); return; }

    // Генеруємо кейси для анімації
    const itemsContainer = document.getElementById("caseItems");
    itemsContainer.innerHTML = "";
    for (let i = 0; i < 15; i++) {
        const div = document.createElement("div");
        div.className = "case-item";
        const item = caseOptions[Math.floor(Math.random()*caseOptions.length)];
        div.innerHTML = `<img src="${item.img}" title="${item.name}">`;
        itemsContainer.appendChild(div);
    }

    // Анімація прокрутки
    const randomIndex = Math.floor(Math.random() * caseOptions.length);
    const offset = randomIndex * 105; // ширина + margin
    itemsContainer.style.transform = `translateX(-${offset}px)`;

    // Після анімації показуємо нагороду та топ
    setTimeout(async () => {
        const res = await fetch("/open-case", {
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ name })
        });
        const data = await res.json();
        if(data.error){ alert(data.error); return; }

        document.getElementById("reward").innerText = "Випало: "+data.reward.name;

        const topList = document.getElementById("topList");
        topList.innerHTML = "";
        data.topPlayers.forEach(p=>{
            const li = document.createElement("li");
            li.innerText = p.name + ": " + p.rewards.join(", ");
            topList.appendChild(li);
        });
    }, 3100); // час анімації
}
