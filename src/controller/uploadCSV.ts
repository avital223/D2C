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


const uploadCSV = (e: { preventDefault: () => void; })=>{
    if( e !== null){
        e.preventDefault();
    }
    const body = getContentCSV()
    fetch("/csv/", {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(body)
    })
    .then((res) => {window.location.href = "/uploadCSV"})
    // tslint:disable-next-line:no-console
    .catch((err) => console.log(err));
}


window.onload=() => {
    const button = document.getElementById("uploadCSV") as HTMLDivElement;
    if(button){
        button.addEventListener("click",uploadCSV)
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
