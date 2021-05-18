//invoke function immediately after being defined
(function fetchData() {
    fetch("https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json")
    .then((response) => {
        if(response.status !== 200) {
            console.log(`There was a problem. Status code: ${response.status}`)
            return;
        }
        return response.json()
    }).then((data) => {
        structureHtmlFromData(data)
    }).catch(error => console.log(`Fetch error`, error))
})()

//utility function which will iterate through the data fetched from the api and render elements to the DOM
function structureHtmlFromData(data) {
    //we are inserting the generated html below the row
    const section = document.querySelector("#card-row");
    data.map(({featured_media, title, _embedded, date, link}, index) => {
        //our date object
        const publishedDate = new Date(date)
        //get month string from date object
        const month = publishedDate.toLocaleString("default", {month: "long"});
        //destructure the object
        const [{name, url}] = _embedded.author
        //array holding type of our publication and tag for our card header
        const embeddedTermArray = _embedded["wp:term"]
        //tag for card header
        const postTag = embeddedTermArray[data.length - index][0].name
        //type of our publication
        const category = embeddedTermArray[0][0].name
        //start populating the DOM
        section.insertAdjacentHTML("afterbegin", 
        `
        <div class="col-4 u-equal-height p-card--highlighted u-no-margin--bottom u-no-padding" style="flex-direction:column">
            <header class="card--header">
                <h5 class="p-text--x-small-capitalised u-align--left u-no-margin--bottom">${postTag}</h5>
            </header>
            <div class="card--content">
                <img class="u-image-position--top" src="${featured_media}" alt="card image"/>
                <h3 class="p-card__title u-align--left" style="font-weight: 300"><a href=${link}>${title.rendered}</a></h3>
                <p class="p-heading--6 u-align--left">By <a href="${url}">${name}</a> on ${publishedDate.getUTCDate()} ${month} ${publishedDate.getFullYear()}</p>
            </div>
            <p class="card--footer u-align--left">${category.slice(0, -1)}</p>
        </div>
        `
        )
    })
}