const getContentCSV = () =>{
    let innerContent = "<h4>Please upload csv file:</h4>"
    let text = "Please upload csv file:"
    let to = ""
    const ansList = Array.from(document.getElementsByTagName("input")as HTMLCollectionOf<HTMLInputElement>)
    for( const opt of ansList){
        if(opt.id.startsWith("c_") && opt.id !== "c_all" && opt.checked){
            const fileId = opt.id.split("_")[1]
            const fileName = document.getElementById(fileId) as HTMLParagraphElement
            innerContent +='<p><a herf="'+window.location.protocol + '//' + window.location.host+'/uploadCSV'+fileId+'" >'+fileName?.innerText+'</a> '
            innerContent+= window.location.protocol + '//' + window.location.host+'/uploadCSV?'+fileId+ '</p>' // try to remove once the web is online
            text +="\n"+fileName?.innerText
        } if (opt.id === "csv"){
            to = opt.value
        }
    }
    // to, subject, html
    return {
        to,
        subject:"Please upload csv file",
        html:innerContent.toString(),
        text
    }
}


const addNewCSV = (e: { preventDefault: () => void; }, id:string)=>{
    if( e !== null){
        e.preventDefault();
    }
    const form = document.getElementById("fill_csv") as HTMLFormElement;
    if(form.innerHTML === ""){
        let newString = ""
        newString += "<table id='questionsTable'><thead><tr><th>Question</th><th>Answers</th><th>Delete</th><th>Add Answer</th></tr></thead><tbody>"
        newString += "<tr id='1'><td><input id='question_1' type='text' class='validate'></td>"
        newString += "<td><p id='answers_1'></p></td>"
        newString += "<td><button id='addBrowser' class='btn-small'><i class='material-icons right'>add</i></button></td></tr></tbody></table>"
        form.innerHTML = newString
    } else{
        const table = document.getElementById("questionsTable") as HTMLTableElement;
        const row = table.insertRow();
        row.id= id;
        let newString = ""
        newString += "<td><input id='question_"+id+"' type='text' class='validate'></td>"
        newString += "<td><p id='answers_"+id+"'></p></td>"
        newString += "<td><button id='deleteQuestion_"+id+"' class='btn-small'><i class='material-icons right'>delete</i></button></td>"
        newString += "<td><button id='addAnswer_"+id+"' class='btn-small'><i class='material-icons right'>add</i></button></td>"
        row.innerHTML = newString;
    }
    const button =  document.getElementById("deleteQuestion_"+id) as HTMLButtonElement;
    button.addEventListener("click", (event)=>{deleteQuestion(event, id)})
    const buttonAdd = document.getElementById("addAnswer_"+id) as HTMLButtonElement;
    buttonAdd.addEventListener("click", (event)=>{addAnswer(event, id, "1")})
    // update the add new question button to add a new question with the next id.
    const addQBtn = document.getElementById("addQuestion") as HTMLButtonElement;
    addQBtn.replaceWith(addQBtn.cloneNode(true));
    const newAddQBtn = document.getElementById("addQuestion") as HTMLButtonElement;
    const newId = (Number(id) +1).toString()
    newAddQBtn.addEventListener('click', (event)=>{addNewQuestion(event, newId)} )
}

const uploadCSV = (e: { preventDefault: () => void; })=>{
    if( e !== null){
        e.preventDefault();
    }
    const body = getContentCSV()
    fetch("/fillTests/url", {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(body)
    })
    .then((res) => {window.location.href = "/addCSV"})
    // tslint:disable-next-line:no-console
    .catch((err) => console.log(err));
}


window.onload=() => {
    const button = document.getElementById("uploadCSV") as HTMLDivElement;
    if(button){
        button.addEventListener("click",uploadCSV)
        fetch("/fillTests/", {
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        .then(response => response.json())
        .then(loadList)
        // tslint:disable-next-line:no-console
        .catch((err) => console.log(err));
    }
}
