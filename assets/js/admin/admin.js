
const pageName = window.location.pathname.split("/").pop();

const navLinks = document.querySelectorAll(".sidebar nav ul li a");

navLinks.forEach((link)=>{
    if(link.getAttribute("href") === pageName || (link.getAttribute("href") === "index.html" && pageName === "")){
        link.classList.add("active");
    }else{
        link.classList.remove("active")
    }
})