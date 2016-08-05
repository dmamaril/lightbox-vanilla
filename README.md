# lightbox-vanilla

## Getting Started

### Step 1: Getting the files
```
git clone https://github.com/dmamaril/lightbox-vanilla.git
cd lightbox-vanilla
python -m SimpleHTTPServer 8080
```

### Step 2: Configuring your API Keys
At this point you'll need to modify the config.json file in the root of the lightbox-vanilla folder to include your Google API Key & CX.

```
{
    "api_key": "YOUR_API_KEY",
    "cx": "YOUR_CUSTOM_SEACH_ENGINE_ID"
}
```

### Step 3: Launching
Let's head back to the terminal and enter the following command:

```
open http://127.0.0.1:8080
```
===

## Improvements
Due to the time constraints, I had to separate the nice-to-have's with the must-haves. Below are some of the improvements I would've loved to implement.

### Infinite Scroll / Auto Load
Definitely a nice to have. It feels natural to just be able to scroll down and let things load automatically once you're at 70% or 80% of the way down, however since everything is in vanilla JavaScript, I had to prioritize and push this down the list. I opted for a Load More button to fetch more images in the meantime. As I was developing the controllers for the views, I realized that I can implement an infinite scroll-esque feel for when users are hitting the next button while viewing the lightbox, so I did.

### Number of elements in the page
This was one of my first concerns, way before I learned that Google API will only give me the first 100 results of any query, but I definitely took some time to give it some though. I considered that if it came down to thousands and thousands of elements, we'll definitely have some issues. What data structure makes sense for this problem, I wondered. I concluded that if I had to handle this scenario, I'd utilize a doubly linked list where each node is a batch of images. Doing so will allow me to choose a subset of nodes as user scrolls up and down a page by simply referring to some node's next or previous.

### UX
Ensuring that a user gets feedback when interacting with the application is critical. Currently when a user clicks "load more", the page just kind of jumps when the images load. Ideally I would've loved to have some indicator that the app is fetching images and that something will occur soon. I would've definitely loved to make use of some icons, but did not get around to it. Smooth animations when viewing pictures in the lightbox is another UX improvement to be had.

### View Caching
By caching the views when navigating, it allows users to navigate back and forth between its different valid routes and expect the results to remain on the page.

### Browserify
I should've totally asked if this was allowed, but between work and this project it kept slipping my mind and marked it as a nice-to-have. Had I used browserify, I could've separated the helper functions into its own modules and brought them in wherever needed. With this approach, I would've been able to test these helper functions much more thoroughly.

### Web Workers
I thought that this would've been a solid opportunity to utilize web workers, but not having used them before, I had to push it to the nice-to-have list. Web Workers would've allowed me to do a lot of processing in another thread so that the user will continue to have a seamless experience with the application.

===
## Thoughts

### Foundation
When I first received this technical challenge, I made sure to focus on building the foundation. I created utility functions as I found needed them in the `utils.js`. I also needed a way to communicate with the API and serve my local files, so I created a general purpose client module with all the CRUD operators in `client.js`. As I built out the application, I learned that multiple modules will need a listener for global `window` events, so I created `events.js` to properly add multiple event listeners for each event. The relationship is one function per source for many events.

### Views
Instead of having all my HTML in one file, I opted to use a router. I realize now that it might be overkill given that we actually ended up with just two other views, but it was fun to implement nonetheless.

### Controllers
All view logic is stored in the `controllers.js` object. I did my best to make all the main controller methods to be as descriptive as possible to reduce mental workload when reading through the code. Controller also manages its own internal state based on user interactions.

### Services
`gapi.js` is our only service. Gapi is the layer on top of `client.js` file that is used to communicate with the Google Custom Search API. Due to gapi constraints, each user query results into five queries in parallel to fetch 50 images whereas a single request only returns 10. Gapi also exposes a number of methods to ensure that special characters are taken care of and transformed into a query that Google Customer Search API expects.

===
## Final Statements
This was an incredibly fun project given its constraints. It was a lot of fun implementing a lot of the modules I use every day into just good ol' JavaScript. The most challenging part of this project was how to properly separate the concerns for each module and how I can have a way of allowing each module to communicate with each other without them being tightly coupled. It was really cool to see my favorite utility functions re-implemented, such as `async.parallel`. This was also a great exercise on how to goal setting / organizing priorities. Of course I want it to display my best possible work, but there had to be some give and take. Overall this was an excellent challenge and even learned a few new things.

===
## TODO:
	* register for API keys [done]
	* apply API keys to requests [done]
	* keyframes of mock ups [done]
		** pages needed
			* modals [done]
			* welcome / sign in ? [done]
			* thumnail view [done]
				* flickr has 650 el max
			* lightbox view [done]
				** ensure left and right arrow keys are listening! [done]
		** ensure responsiveness [done]
	* TESTING!!!!!!
	* ERROR HANDLERS FOR FAIL IMG LOOKUP [done]
	* mobile headers on html [done]
	* need to finish paging and querying [done]
		>> need to work on lightbox modal [done]
		>> need to fit image properly [done]
			>> tll img src http://blogs.djc.com/blogs/SeattleScape/wp-content/uploads/2012/08/chinatwo.jpg
			>> wide& tall https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQnrml_8xtiS939Jj4TVJrymzqOMCAbj8_B6SMuUvAHDnF3xh5H

	* caching results & next batch
	* replacing thumbnails on new query [done]
	* caching views
	* loading indicators for slow parent src queries
	* bug on searching from main page; >> wait for route change to complete; [fixed]

	* implement throttle for load btn instead? or just update view with placeholders? unsure;
	* state gets all wonky when routing back to / from /#gallery [done]
	* automatically load more when looking at next pictures at about 80% of image index [done]
	* on enlarge, images remain small [done]
	* add padding to top and bottom of modal-image [done]
	* error handling views (403 rate limit, timeout, 401s etc) [done]
	* body has excess height [done]
	* GAPI only permits 100 images; [done]
	* remove sync ability for client; [done]
	* on previous image safeaguard to ensure element exists [done]
	* footer indicator when max images has been reached