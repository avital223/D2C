const addTextToEditors = (data:any) => {
    const i=0
}

window.onload=() => {
    const url = window.location.search;
    const queryStart = url.indexOf("?") + 1
    const queryEnd   = url.indexOf("#") + 1 || url.length + 1
    const query = url.slice(queryStart, queryEnd - 1)
    const queryArr = query.replace(/\+/g, " ").split("&");
    const listRes = queryArr[0].split("=")[1].split(" ")
    const bdi = queryArr[1].split("=")[1]
    const bai = queryArr[2].split("=")[1]
    const cognitive = queryArr[3].split("=")[1]
    const psychological = queryArr[4].split("=")[1]
    const physical = queryArr[5].split("=")[1]
    const body ={
        "name":"{name}",
        "resultsids":listRes,
        "bdi":bdi,
        "bai":bai,
        "cognitive":cognitive,
        "psychological":psychological,
        "physical":physical
    }
    fetch("/report/", {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    // tslint:disable-next-line:no-console
    .then(addTextToEditors)
}