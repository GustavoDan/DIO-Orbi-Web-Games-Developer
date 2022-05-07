const BASE_URL = 'https://thatcopy.pw/catapi/rest/';

async function getNewCat() {
    try{
        let req = await fetch(BASE_URL);
        let json = await req.json();
        return json.webpurl
    } catch(e){
        console.log(e)
    }
}

async function loadNewCat() {
    document.querySelector('#cat').src = await getNewCat();
}

document.querySelector('#change-cat').addEventListener('click', loadNewCat);

loadNewCat();
