const nav = document.getElementById("nav")
const tmp =document.URL.split("/")
const title = tmp[tmp.length-1]
const html = ["TP1.html","TP2.html","TP3.html","TP4.html"]
const titles = ["Basic geometry","First particles","Particle wave", "Smoke"]
for (let i=0;i<html.length;i++) {
    const a = document.createElement("a")
    a.href=html[i]
    if (title===html[i])
        a.className="active"
    const button = document.createElement("button")
    button.appendChild(document.createTextNode(titles[i]))
    a.appendChild(button)
    nav.appendChild(a)
}