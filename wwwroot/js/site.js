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


const search = document.querySelector('.input-group input'),
    table_rows = document.querySelectorAll('tbody tr'),
    table_headings = document.querySelectorAll('thead th');

// 1. Searching for specific data of HTML table
search.addEventListener('input', searchTable);

function searchTable() {
    table_rows.forEach((row, i) => {
        let table_data = row.textContent.toLowerCase(),
            search_data = search.value.toLowerCase();

        row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
        row.style.setProperty('--delay', i / 25 + 's');
    })

    document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
        visible_row.style.backgroundColor = (i % 2 == 0) ? 'transparent' : '#0000000b';
    });
}

// 2. Sorting | Ordering data of HTML table

table_headings.forEach((head, i) => {
    let sort_asc = true;
    head.onclick = () => {
        table_headings.forEach(head => head.classList.remove('active'));
        head.classList.add('active');

        document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
        table_rows.forEach(row => {
            row.querySelectorAll('td')[i].classList.add('active');
        })

        head.classList.toggle('asc', sort_asc);
        sort_asc = head.classList.contains('asc') ? false : true;

        sortTable(i, sort_asc);
    }
})


function sortTable(column, sort_asc) {
    [...table_rows].sort((a, b) => {
        let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase(),
            second_row = b.querySelectorAll('td')[column].textContent.toLowerCase();

        return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
    })
        .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
}

// 3. Converting HTML table to PDF

const pdf_btn = document.querySelector('#toPDF');
const customers_table = document.querySelector('#customers_table');

const toPDF = function (customers_table) {
    const html_code = `
    <link rel="stylesheet" href="style.css">
    <main class="table" >${customers_table.innerHTML}</main>
    `;

    const new_window = window.open();
    new_window.document.write(html_code);

    setTimeout(() => {
        new_window.print();
        new_window.close();
    }, 400);
}

pdf_btn.onclick = () => {
    toPDF(customers_table);
}

// 4. Converting HTML table to JSON

const json_btn = document.querySelector('#toJSON');

const toJSON = function (table) {
    let table_data = [],
        t_head = [],

        t_headings = table.querySelectorAll('th'),
        t_rows = table.querySelectorAll('tbody tr');

    for (let t_heading of t_headings) {
        let actual_head = t_heading.textContent.trim().split(' ');

        t_head.push(actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase());
    }

    t_rows.forEach(row => {
        const row_object = {},
            t_cells = row.querySelectorAll('td');

        t_cells.forEach((t_cell, cell_index) => {
            const img = t_cell.querySelector('img');
            if (img) {
                row_object['customer image'] = decodeURIComponent(img.src);
            }
            row_object[t_head[cell_index]] = t_cell.textContent.trim();
        })
        table_data.push(row_object);
    })

    return JSON.stringify(table_data, null, 4);
}

json_btn.onclick = () => {
    const json = toJSON(customers_table);
    downloadFile(json, 'json')
}

// 5. Converting HTML table to CSV File

const csv_btn = document.querySelector('#toCSV');

const toCSV = function (table) {
    // Code For SIMPLE TABLE
    // const t_rows = table.querySelectorAll('tr');
    // return [...t_rows].map(row => {
    //     const cells = row.querySelectorAll('th, td');
    //     return [...cells].map(cell => cell.textContent.trim()).join(',');
    // }).join('\n');

    const t_heads = table.querySelectorAll('th'),
        tbody_rows = table.querySelectorAll('tbody tr');

    const headings = [...t_heads].map(head => {
        let actual_head = head.textContent.trim().split(' ');
        return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
    }).join(',') + ',' + 'image name';

    const table_data = [...tbody_rows].map(row => {
        const cells = row.querySelectorAll('td'),
            img = decodeURIComponent(row.querySelector('img').src),
            data_without_img = [...cells].map(cell => cell.textContent.replace(/,/g, ".").trim()).join(',');

        return data_without_img + ',' + img;
    }).join('\n');

    return headings + '\n' + table_data;
}

csv_btn.onclick = () => {
    const csv = toCSV(customers_table);
    downloadFile(csv, 'csv', 'customer orders');
}

// 6. Converting HTML table to EXCEL File

const excel_btn = document.querySelector('#toEXCEL');

const toExcel = function (table) {
    // Code For SIMPLE TABLE
    // const t_rows = table.querySelectorAll('tr');
    // return [...t_rows].map(row => {
    //     const cells = row.querySelectorAll('th, td');
    //     return [...cells].map(cell => cell.textContent.trim()).join('\t');
    // }).join('\n');

    const t_heads = table.querySelectorAll('th'),
        tbody_rows = table.querySelectorAll('tbody tr');

    const headings = [...t_heads].map(head => {
        let actual_head = head.textContent.trim().split(' ');
        return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
    }).join('\t') + '\t' + 'image name';

    const table_data = [...tbody_rows].map(row => {
        const cells = row.querySelectorAll('td'),
            img = decodeURIComponent(row.querySelector('img').src),
            data_without_img = [...cells].map(cell => cell.textContent.trim()).join('\t');

        return data_without_img + '\t' + img;
    }).join('\n');

    return headings + '\n' + table_data;
}

excel_btn.onclick = () => {
    const excel = toExcel(customers_table);
    downloadFile(excel, 'excel');
}

const downloadFile = function (data, fileType, fileName = '') {
    const a = document.createElement('a');
    a.download = fileName;
    const mime_types = {
        'json': 'application/json',
        'csv': 'text/csv',
        'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
    a.href = `
        data:${mime_types[fileType]};charset=utf-8,${encodeURIComponent(data)}
    `;
    document.body.appendChild(a);
    a.click();
    a.remove();
}



// CODIGO ICONO NOTIFICACION
const notify = () => {
  let random = Math.floor(Math.random() * 6);
  let music = ["roar", "phineas", "mario", "looney", "pikachu", "notification"];

  let name = [
    "Pikachu Roar",
    "Phineas & Ferb",
    "Mario",
    "Looney Tune",
    "Pikachu Remix",
    "Notification"
  ];

  let token = [
    "56419864-7583-4027-94ae-bac037cfbf05",
    "e03dc5bd-0658-4b5e-bb4a-7c06dbe662ab",
    "cb85e793-402f-4608-8f07-9147573e0a26",
    "923b7153-897c-4fe4-b3f5-0cb240a98845",
    "5489352c-9b44-4425-9be9-9cfa689eaf35",
    "6c60c631-1aa1-4337-b000-775e0de15a5e"
  ];

  var audio = new Audio(
    `https://firebasestorage.googleapis.com/v0/b/relatorio-callcenter.appspot.com/o/${music[random]}.mp3?alt=media&token=${token[random]}`
  );
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  } else {
    new Notification("Notification", {
      icon:
        "http://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_audio_x128.png",
      body: name[random],
      sound: true
    });
    audio.play();
  }
};


function volver(){
    window.history.back();
  }

  