const getContent = () =>{
    const innerContent = "<h4>New massage from D2c</h4>"
    const text = "New massage from D2C"
    const to = ""
    const subject = ""
    const from = ""
    // for( const opt of ansList){
    //     if(opt.id.startsWith("c_") && opt.id !== "c_all" && opt.checked){
    //         const questionareId = opt.id.split("_")[1]
    //         const questionareName = document.getElementById(questionareId) as HTMLParagraphElement
    //         innerContent +='<p><a herf="'+window.location.protocol + '//' + window.location.host+'/fillQuestionare?'+questionareId+'" >'+questionareName?.innerText+'</a> '
    //         innerContent+= window.location.protocol + '//' + window.location.host+'/fillQuestionare?'+questionareId+ '</p>' // try to remove once the web is online
    //         text +="\n"+questionareName?.innerText
    //     } if (opt.id === "email"){
    //         to = opt.value
    //     }
    // }
    // from, to, subject, html
    return {
        from,
        to,
        subject,
        html:innerContent.toString(),
        text
    }
}


const sendMail = (e: { preventDefault: () => void; })=>{
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
    .then((res) => {window.location.href = "/thankYou"})
    // tslint:disable-next-line:no-console
    .catch((err) => console.log(err));
}

const checkFunction = (e: { preventDefault: () => void; })=>{
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

window.onload=() => {
    const button = document.getElementById("sendMail") as HTMLDivElement;
    if(button){
        button.addEventListener("click",sendMail)
        fetch("/db/", {
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        .then(response => response.json())
        // tslint:disable-next-line:no-console
        .catch((err) => console.log(err));
    }
}

