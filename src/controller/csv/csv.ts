const showText = (_event: MouseEvent)=>{
    // _event.preventDefault();
    const frame = document.getElementById("hiddenFrame") as HTMLIFrameElement;
    frame.hidden=false
}

window.onload=() => {
    const btn = document.getElementById("send") as HTMLButtonElement;
    btn.addEventListener("click",showText)
}