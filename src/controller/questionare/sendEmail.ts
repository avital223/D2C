const getContentMail = () =>{
    let innerContent = "<h4>Please fill the following Questionares:</h4>"
    let text = "Please fill the following Questionares:"
    let to = ""
    const ansList = Array.from(document.getElementsByTagName("input")as HTMLCollectionOf<HTMLInputElement>)
    for( const opt of ansList){
        if(opt.id.startsWith("c_") && opt.id !== "c_all" && opt.checked){
            const questionareId = opt.id.split("_")[1]
            const questionareName = document.getElementById(questionareId) as HTMLParagraphElement
            innerContent +='<p><a herf="'+window.location.protocol + '//' + window.location.host+'/fillQuestionare?'+questionareId+'" >'+questionareName?.innerText+'</a> '
            innerContent+= window.location.protocol + '//' + window.location.host+'/fillQuestionare?'+questionareId+ '</p>' // try to remove once the web is online
            text +="\n"+questionareName?.innerText
        } if (opt.id === "email"){
            to = opt.value
        }
    }
    // to, subject, html
    return {
        to,
        subject:"Please fill the following Questionare",
        html:innerContent.toString(),
        text
    }
}

const sendEmail = (e: { preventDefault: () => void; })=>{
    if( e !== null){
        e.preventDefault();
    }
    const body = getContentMail()
    fetch("/email/", {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(body)
    })
    .then((res) => {window.location.href = "/listQuestionare"})
    // tslint:disable-next-line:no-console
    .catch((err) => console.log(err));
}

const checkAllFunction = (e: { preventDefault: () => void; })=>{
    if( e !== null){
        e.preventDefault();
    }
    const checkAll = document.getElementById("c_all") as HTMLInputElement
    const ansList = Array.from(document.getElementsByTagName("input")as HTMLCollectionOf<HTMLInputElement>)
    for( const opt of ansList){
        if(opt.id.startsWith("c_") && opt.id !== "c_all" ){
            opt.checked = checkAll.checked
        }
    }
}

const loadList =(data : any)=>{
    const form = document.getElementById("listToSend") as HTMLDivElement;
    if(Object.keys(data).length === 0){
        form.innerHTML = "<p> No Questionares yet! </p>"
    } else{
        let innerString = ""
        innerString += "<table><thead><tr><th>Name of Questionare</th><th><p><label><input type='checkbox'  id='c_all'><span></span></label></p></th></tr></thead><tbody>"
        for( const questionare of data){
            innerString += "<tr><td><p id='"+questionare._id+"'>"+questionare.name+"</p></td>"
            innerString+="<td><p><label><input type='checkbox'  id='c_"+questionare._id+"'>"
            innerString+="<span></span></label></p></td></tr>"
        }
        innerString += "</table>"
        form.innerHTML=innerString
    }
    const checkAll = document.getElementById("c_all") as HTMLInputElement
    checkAll.addEventListener("change", checkAllFunction)
}

window.onload=() => {
    const button = document.getElementById("sendEmail") as HTMLDivElement;
    if(button){
        button.addEventListener("click",sendEmail)
        fetch("/db/", {
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
