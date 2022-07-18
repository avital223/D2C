const getContentUs = () =>{
    const email = document.getElementById("email") as HTMLInputElement;
    const msg = document.getElementById("massage") as HTMLInputElement;
    const rating = Array.from(document.getElementsByName("stars")  as NodeListOf<HTMLInputElement>);
    let ratingTXT = ""
    for(const j of rating){
        if(j.checked){
            const numR = parseInt(j.id.replace("e",""),10)
            for (let i=0;i<numR;i++){
                ratingTXT+="★"
            }
            for (let i=0;i<5-numR;i++){
                ratingTXT+="☆"
            }
            break
        }
    }
    const text = "A new Message from "+email.value+"\n\n"+msg.value
    let innerContent = "<h4>A new Message from "+email.value+"<h4><br/><br/><p>"+msg.value+"</p><br/>"
    if (ratingTXT!==""){
        innerContent+="<p>The raiting given of this website is: "+ratingTXT+" </p>"
    }
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

