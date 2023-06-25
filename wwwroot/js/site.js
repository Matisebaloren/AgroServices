const body = document.querySelector("body");
const darkLight = document.querySelector("#darkLight");
const sidebar = document.querySelector(".sidebar");
const submenuItems = document.querySelectorAll(".submenu_item");
const sidebarOpen = document.querySelector("#sidebarOpen");
const sidebarClose = document.querySelector(".collapse_sidebar");
const sidebarExpand = document.querySelector(".expand_sidebar");
sidebarOpen.addEventListener("click", () => sidebar.classList.toggle("close"));

// sidebarClose.addEventListener("click", () => {
//   sidebar.classList.add("close", "hoverable");
// });
// sidebarExpand.addEventListener("click", () => {
//   sidebar.classList.remove("close", "hoverable");
// });

sidebar.addEventListener("mouseenter", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.remove("close");
  }
});
sidebar.addEventListener("mouseleave", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.add("close");
  }
});

// darkLight.addEventListener("click", () => {
//   body.classList.toggle("dark");
//   if (body.classList.contains("dark")) {
//     document.setI
//     darkLight.classList.replace("bx-sun", "bx-moon");
//   } else {
//     darkLight.classList.replace("bx-moon", "bx-sun");
//   }
// });

submenuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    item.classList.toggle("show_submenu");
    submenuItems.forEach((item2, index2) => {
      if (index !== index2) {
        item2.classList.remove("show_submenu");
      }
    });
  });
});

// if (window.innerWidth < 768) {
//   sidebar.classList.add("close");
// } else {
//   sidebar.classList.remove("close");
// }

//FIN DE FUNCIONES DEL NAVBAR VERTICALIZADO

// CREANDO FILTRADO DE BUSQUEDA INTERNO

// document.getElementById("inputSearch").addEventListener("keyup", buscador_interno);

// function buscador_interno(){


//     filter = inputSearch.value.toUpperCase();
//     li = box_search.getElementsByTagName("li");

    //Recorriendo elementos a filtrar mediante los "li"
  //   for (i = 0; i < li.length; i++){

  //       a = li[i].getElementsByTagName("a")[0];
  //       textValue = a.textContent || a.innerText;

  //       if(textValue.toUpperCase().indexOf(filter) > -1){

  //           li[i].style.display = "";
  //           box_search.style.display = "block";

  //           if (inputSearch.value === ""){
  //               box_search.style.display = "none";
  //           }

  //       }else{
  //           li[i].style.display = "none";
  //       }

  //   }

  // }



//CREANDO FILTRADO DE BUSQUEDA.
// document.getElementById("inputSearch").addEventListener("keyup",buscador_interno);


// function buscador_interno(){

//   filter = inputSearch.value.toUpperCase();
//   li = box_search.getElementsByTagName("li");

//   //RECORRIENDO ELEMENTOS A FILTRAR MEDIANTE "LI"
//   for (1 = 0; 1 < li.length; 1++){

//     a = li[i].getElementsByTagName("a")[0];
//     textValue = a.textContent || a.innerText; 
    
//     if (textValue.toUpperCase().indexOf(filter) > -1){

//       li[1].style.display = "";
//       box_search.style.display = "block";
      
//       if(inputSearch.value === ""){
//         box_search.style.display = "none"; 
//       }

//     }else{
//       li[1].style.display = "none"; 
//     }
      
    
//   }


// }

// const searchWrapper = document.querySelector(".search-input");
// const inputBox = searchWrapper.querySelector(".search-input");
// const suggBox = searchWrapper.querySelector(".autocom-box");
// const icon = searchWrapper.querySelector(".icon");
// let linkTag = searchWrapper.querySelector(".a");

// inputBox.onkeyup = (e)=>{
//     let userData = e.target.value;
//     let emptyArray = [];
//     if (userData) {
//         webLink = "https://www.google.es/search?q=$(userData)";
//         linkTag.setAttribute("href", webLink);
//         linkTag.click();
//     }
//     emptyArray = suggestions.Filter((data)=>{

//         return
//         data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
//         });

//         emptyArray = emptyArray.map((data)=>{
//             return data ="<li>${data}</li>";
            
//         });

//         searchWrapper.classList.add("active");
//         showSuggestions(emptyArray);
//         let allList = suggBox.querySelectorAll("li");
//         for (let i=0; i< allList.length; i++){
//             allList[i].setAttribute("onclick", "select(this)"); 
//         // }else{
//         //     searchWrapper.classList.remove("active");
//         // }

//     }

//     function select(element) {
//         let selectData = element.textContent;
//         inputBox.value = selectData;
//         icon.onclick = ()=>{
//             webLink = "https://www.google.es/search?q=$(userData)";
//             linkTag.setAttribute("href", webLink);
//             linkTag.click(); 
//         }
//         searchWrapper.classList.remove("active")
//     }

//     function showSuggestions(list) {
//         let listData;
//         if (list.length) {
//             userValue=inputBox.value;
//             listData="<li>${userValue}</li>";
//         }else{
//             listData=list.join("");
//         }
//         suggBox.innerHTML-listData;
        
//     }


