const updateQuestionareRedirect = (_event: MouseEvent, id: string)=>{
    _event.preventDefault();
    window.location.href = "/editQuestionare?"+id
}

const fillQuestionareLink = (_event: MouseEvent, id: string)=>{
    _event.preventDefault();
    window.location.href = "/fillQuestionare?"+id
}


const deleteQuestionare = (_event: MouseEvent, id: string)=>{
    _event.preventDefault();
    fetch("/db/"+id, {
        method: 'DELETE',
        headers:{
            'Content-Type':'application/json'
        },
    }).then(()=>{
        window.location.reload();
    })
    // tslint:disable-next-line:no-console
    .catch((err) => console.log(err));
}

const addDeleteAndUpadteFunctions =(arrayIds : string[])=>{
    for( const id of arrayIds){
        const link = document.getElementById(id) as HTMLParagraphElement
        link.addEventListener("click", (event)=>{fillQuestionareLink(event, id)})
        const dButton = document.getElementById("d_"+id) as HTMLButtonElement;
        dButton.addEventListener("click", (event)=>{deleteQuestionare(event, id)})
        const uButton = document.getElementById("u_"+id) as HTMLButtonElement;
        uButton.addEventListener("click", (event)=>{updateQuestionareRedirect(event, id)})
    }
}

const loadQuestionare = (data: any) => {
    const form = document.getElementById("List") as HTMLDivElement;
    if(Object.keys(data).length === 0){
        form.innerHTML = "<p> No Questionares yet! </p>"
    } else{
        const arrayIds = []
        let innerString = ""
        innerString += "<table><thead><tr><th>Name of Questionare</th><th></th><th></th></tr></thead><tbody>"
        for( const questionare of data){
            innerString += "<tr><td><p id='"+questionare._id+"'>"+questionare.name+"</p></td>"
            innerString+="<td><button id='d_"+questionare._id+"' class='btn-small'><i class='material-icons right'>delete</i>Delete</button></td>"
            innerString+="<td><button id='u_"+questionare._id+"' class='btn-small'><i class='material-icons right'>edit</i>Edit</button></td></tr>"
            arrayIds.push(questionare._id)
        }
        innerString += "</table>"
        form.innerHTML=innerString
        addDeleteAndUpadteFunctions(arrayIds)
    }
}

window.onload=() => {
    const form = document.getElementById("List") as HTMLDivElement;
    if(form){
        fetch("/db/", {
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        .then(response => response.json())
        .then(loadQuestionare)
        // tslint:disable-next-line:no-console
        .catch((err) => console.log(err));
    } else {
        // tslint:disable-next-line:no-console
        console.log("ERROR")
    }
}
