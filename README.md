# lightbox-vanilla

## Getting Started

```
git clone https://github.com/dmamaril/lightbox-vanilla.git
cd lightbox-vanilla
python -m SimpleHTTPServer 8080
open http://localhost:8080
```

## Notes
http://stackoverflow.com/a/28139063 re inline listeners

## TODO:
	* register for API keys [done]
	* apply API keys to requests [done]
	* keyframes of mock ups [done]
		** pages needed
			* modals [done]
			* welcome / sign in ? [done-ish]
			* thumnail view [done-ish]
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
	* bug on searching from main page; >> wait for route change to complete; [fix]

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