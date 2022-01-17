const nav = document.getElementById("nav")
const html = ["TP1.html","TP2.html","TP3.html","TP4.html"]
const titles = ["Basic geometry","First particles","Particle wave", "Smoke"]
for (let i=0;i<html.length;i++) {
    const a = document.createElement("a")
    a.href=html[i]
    const button = document.createElement("button")
    button.appendChild(document.createTextNode(titles[i]))
    a.appendChild(button)
    nav.appendChild(a)
}
