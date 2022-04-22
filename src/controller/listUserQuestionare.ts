const updateFillQuestionareRedirect = (_event: MouseEvent, id: string) => {
    _event.preventDefault();
    window.location.href = "/fillQuestionare?"+id
}

const addFunctionsMyQuestionare = (arrayIds : string[]) => {
    for( const id of arrayIds){
        const uButton = document.getElementById("u_"+id) as HTMLButtonElement;
        uButton.addEventListener("click", (event)=>{updateFillQuestionareRedirect(event, id)})
        fetch("/db/"+id, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            },
        }).then(response => response.json())
        .then((data) => {
            const p = document.getElementById(id) as HTMLParagraphElement;
            p.textContent = data.name
        })
        // tslint:disable-next-line:no-console
        .catch((err) => console.log(err));
    }
}


const listUserQuestionare = (data: any) => {
    const form = document.getElementById("List") as HTMLDivElement;
    if(Object.keys(data).length === 0){
        form.innerHTML = "<p> No Questionares yet! </p>"
    } else{
        const arrayIds = []
        let innerString = ""
        innerString += "<table><thead><tr><th>Name of Questionare</th><th></th></tr></thead><tbody>"
        for( const questionare of data){
            innerString += "<tr><td><p id='"+questionare.questionareId+"'></p></td>"
            innerString+="<td><button id='u_"+questionare.questionareId+"' class='btn-small'><i class='material-icons right'>update</i>Fill</button></td></tr>"
            arrayIds.push(questionare.questionareId)
        }
        innerString += "</table>"
        form.innerHTML=innerString
        addFunctionsMyQuestionare(arrayIds)
    }
}

window.onload=() => {
    const form = document.getElementById("List") as HTMLDivElement;
    const email = document.getElementById("email") as HTMLInputElement;
    if(form && email){
        fetch("/filled/"+email.value, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        .then(response => response.json())
        .then(listUserQuestionare)
        // tslint:disable-next-line:no-console
        .catch((err) => console.log(err));
    } else {
        // tslint:disable-next-line:no-console
        console.log("ERROR")
    }
}
