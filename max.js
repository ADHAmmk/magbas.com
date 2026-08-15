function col() {
    let phone = "201013984024"
    let pop = prompt ("منفضلك ادخل اسمك")
    let massege = `انا اسمي ${pop}`
    

    let url = `https://wa.me/${phone}?text=${encodeURIComponent(massege)}`
    window.open(url, "_blank")
}

function toggleMenu() {
    document.querySelector("#nav").classList.toggle("active");
}

function oppo(){
   
    const vy = document.getElementById("ghj")
    vy.classList.toggle("feed")
    const l = document.getElementById("lol")
    l.classList.toggle("bod")
    const opes = document.getElementById("footer-yes")
    opes.classList.toggle("topet")
}