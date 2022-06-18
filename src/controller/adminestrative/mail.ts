const getContentUs = () =>{
    const email = document.getElementById("email") as HTMLInputElement;
    const msg = document.getElementById("massage") as HTMLInputElement;
    const text = "A new Message from "+email.value+"\n\n"+msg.value
    const innerContent = "<h4>A new Message from "+email.value+"<h4><br/><br/><p>"+msg.value+"</p>"
    // to, subject, html
    return {
        subject:"A message from "+email.value,
        html:innerContent.toString(),
        text
    }
}

const sendMail = (e: { preventDefault: () => void; })=>{
    if( e !== null){
        e.preventDefault();
    }
    const body =getContentUs()
    fetch("/contactUs", {
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

window.onload=() => {
    const button = document.getElementById("submit") as HTMLDivElement;
    if(button){
        button.addEventListener("click",sendMail)
    }
}

