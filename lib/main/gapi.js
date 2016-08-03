(function () {

    var gapi, HOST_URI, API_KEY, BASE_URI;

    HOST_URI    = 'https://www.googleapis.com/customsearch/v1?imgType=photo&fields=items&';
    API_KEY     = '';

    gapi = {
        cache   : {},
        base_uri: HOST_URI + API_KEY
    };

    /**
     * [getData description]
     * 
     * where batch_num is incremented by "Load more" btn clicks
     *  && where each batch is 50 results at least
     *      >> each API search returns 10 items max;
     *
     * batch_num 0 will have start_indexes of [0, 10, 20, 30, 40];
     * batch_num 1 will have start_indexes of [50, ..., 90]
     *
     *
     * talking point:
     *   another approach is to trickle the results in;
     *
     * @param  {[type]}   query     [description]
     * @param  {[type]}   batch_num [description]
     * @param  {Function} done      [description]
     * @return {[type]}             [description]
     */
    gapi.getData = function getData(query, batch_num, done) {

        var start_indexes, parallel_fns, i, prev_batch, base_uri;

        if (!_.isFunction(done)) {
            return; //refuse to continue calls if no cb is provided;
        }

        if (!_.isString(query) || query === '') {
            return done(null, []);
        }

        if (!_.isNumber(batch_num)) {
            batch_num = 1;
        }

        base_uri        = this.base_uri;
        start_indexes   = [batch_num * 50];

        // cap to 5 batches;
        // add 10 to previous batch;
        for (i = 1 ; i < 5 ; i++) {

            prev_batch = start_indexes[i-1];
            start_indexes.push(prev_batch + 10);
        }

        // return a fn that queries for images;
        // _.asyncParallel takes in an array of Fns; this will be the input;
        parallel_fns = _.map(start_indexes, function (start_index) {

            var uri = base_uri + '&q=' + query + '&startIndex=' + start_index;
            uri = 'blargh';

            return _.partial(client.get, uri);
        });

        _.asyncParallel(parallel_fns, function onParallelComplete(err, results) {

            err = null;

            results = [
                {

                    statusCode: 200,

                    body: {
                     "items": [
                      {
                       "kind": "customsearch#result",
                       "title": "Tabby Cat - Chrome Web Store",
                       "htmlTitle": "Tabby \u003cb\u003eCat\u003c/b\u003e - Chrome Web Store",
                       "link": "https://chrome.google.com/webstore/detail/tabby-cat/mefhakmgclhhfbdadeojlkbllmecialg",
                       "displayLink": "chrome.google.com",
                       "snippet": "Jul 7, 2016 ... Tabby Cat generates a new furry friend in every tab. Tabby cats blink, sleep, and \neven let you pet them – just like real cats! If you're really lucky, ...",
                       "htmlSnippet": "Jul 7, 2016 \u003cb\u003e...\u003c/b\u003e Tabby \u003cb\u003eCat\u003c/b\u003e generates a new furry friend in every tab. Tabby \u003cb\u003ecats\u003c/b\u003e blink, sleep, and \u003cbr\u003e\neven let you pet them – just like real \u003cb\u003ecats\u003c/b\u003e! If you&#39;re really lucky,&nbsp;...",
                       "cacheId": "fUnRDLDiPeYJ",
                       "formattedUrl": "https://chrome.google.com/...cat/mefhakmgclhhfbdadeojlkbllmecialg",
                       "htmlFormattedUrl": "https://chrome.google.com/...\u003cb\u003ecat\u003c/b\u003e/mefhakmgclhhfbdadeojlkbllmecialg",
                       "pagemap": {
                        "offer": [
                         {
                          "price": "$0",
                          "pricecurrency": "USD",
                          "availability": "http://schema.org/InStock"
                         },
                         {
                          "price": "$0",
                          "pricecurrency": "USD",
                          "availability": "http://schema.org/InStock"
                         }
                        ],
                        "cse_thumbnail": [
                         {
                          "width": "102",
                          "height": "102",
                          "src": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTOBeklHVfa2eIHnQeEplPi3CYa4WiemudNZiGaUnyat9PqEmro6SumVw"
                         }
                        ],
                        "webapplication": [
                         {
                          "name": "Tabby Cat",
                          "url": "https://chrome.google.com/webstore/detail/tabby-cat/mefhakmgclhhfbdadeojlkbllmecialg",
                          "image": "https://lh3.googleusercontent.com/4-VU6M-WX2bMrzZJOnfx0hmuI3a4XjuJzi93wYTn7k5IfhcIVEDglyRbvLhghdHG-xtksZhJBg=s128-h128-e365",
                          "version": "0.97",
                          "softwareapplicationcategory": "http://schema.org/OtherApplication",
                          "interactioncount": "UserDownloads:127,771",
                          "operatingsystems": "Chrome",
                          "description": "A new cat for every new tab."
                         },
                         {
                          "name": "Tabby Cat",
                          "image": "https://lh3.googleusercontent.com/4-VU6M-WX2bMrzZJOnfx0hmuI3a4XjuJzi93wYTn7k5IfhcIVEDglyRbvLhghdHG-xtksZhJBg=s128-h128-e365",
                          "version": "0.97",
                          "softwareapplicationcategory": "http://schema.org/OtherApplication",
                          "interactioncount": "UserDownloads:127,771",
                          "operatingsystems": "Chrome",
                          "description": "A new cat for every new tab."
                         }
                        ],
                        "document": [
                         {
                          "page_lang_safe": "en",
                          "item_category": "EXTENSION",
                          "container": "CHROME",
                          "family_unsafe": "false",
                          "user_count": "127771",
                          "supported_regions": "AE,AR,AT,AU,BE,BG,BR,CA,CH,CL",
                          "payment_type": "free",
                          "canonical": "true",
                          "kiosk": "false",
                          "by_google": "false",
                          "works_offline": "false",
                          "available_on_android": "false",
                          "autogen": "false",
                          "stars2": "true",
                          "stars3": "true",
                          "stars4": "true",
                          "stars5": "false",
                          "category": "14_fun"
                         },
                         {
                          "page_lang_safe": "en",
                          "item_category": "EXTENSION",
                          "container": "CHROME",
                          "family_unsafe": "false",
                          "user_count": "141427",
                          "supported_regions": "AE,AR,AT,AU,BE,BG,BR,CA,CH,CL",
                          "payment_type": "free",
                          "canonical": "true",
                          "kiosk": "false",
                          "by_google": "false",
                          "works_offline": "false",
                          "available_on_android": "false",
                          "autogen": "false",
                          "stars2": "true",
                          "stars3": "true",
                          "stars4": "true",
                          "stars5": "false",
                          "category": "14_fun",
                          "pagerank_devurl": "0",
                          "wilson_star_rating": "4.219282301501518",
                          "unpub_user_count": "141427"
                         }
                        ],
                        "aggregaterating": [
                         {
                          "ratingvalue": "4.341753343239227",
                          "ratingcount": "673"
                         },
                         {
                          "ratingvalue": "4.341753343239227",
                          "ratingcount": "673"
                         }
                        ],
                        "metatags": [
                         {
                          "referrer": "origin",
                          "og:title": "Tabby Cat",
                          "og:description": "A new cat for every new tab.",
                          "og:type": "website",
                          "og:url": "https://chrome.google.com/webstore/detail/tabby-cat/mefhakmgclhhfbdadeojlkbllmecialg",
                          "og:image": "https://lh3.googleusercontent.com/4-VU6M-WX2bMrzZJOnfx0hmuI3a4XjuJzi93wYTn7k5IfhcIVEDglyRbvLhghdHG-xtksZhJBg=s128-h128-e365",
                          "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0"
                         }
                        ],
                        "cse_image": [
                         {
                          "src": "https://lh3.googleusercontent.com/4-VU6M-WX2bMrzZJOnfx0hmuI3a4XjuJzi93wYTn7k5IfhcIVEDglyRbvLhghdHG-xtksZhJBg=s128-h128-e365"
                         }
                        ]
                       }
                      },
                      {
                       "kind": "customsearch#result",
                       "title": "CATS Extension - Chrome Web Store",
                       "htmlTitle": "\u003cb\u003eCATS\u003c/b\u003e Extension - Chrome Web Store",
                       "link": "https://chrome.google.com/webstore/detail/cats-extension/elhkfmcodhgaoodhemkeempcihlcbpia",
                       "displayLink": "chrome.google.com",
                       "snippet": "Easily add candidates and contacts from popular websites directly into the CATS \napplicant tracking system.",
                       "htmlSnippet": "Easily add candidates and contacts from popular websites directly into the \u003cb\u003eCATS\u003c/b\u003e \u003cbr\u003e\napplicant tracking system.",
                       "cacheId": "id4aYpEia1cJ",
                       "formattedUrl": "https://chrome.google.com/.../cats.../elhkfmcodhgaoodhemkeempcihlcbpia",
                       "htmlFormattedUrl": "https://chrome.google.com/.../\u003cb\u003ecats\u003c/b\u003e.../elhkfmcodhgaoodhemkeempcihlcbpia",
                       "pagemap": {
                        "offer": [
                         {
                          "price": "$0",
                          "pricecurrency": "USD",
                          "availability": "http://schema.org/InStock"
                         },
                         {
                          "price": "$0",
                          "pricecurrency": "USD",
                          "availability": "http://schema.org/InStock"
                         }
                        ],
                        "cse_thumbnail": [
                         {
                          "width": "102",
                          "height": "102",
                          "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUcIae5rJQh1-S4ClFtEnnC7UHKTrV5XrxfS_dSAFPGgW8nGsXAZ7t"
                         }
                        ],
                        "webapplication": [
                         {
                          "name": "CATS Extension",
                          "url": "https://chrome.google.com/webstore/detail/cats-extension/elhkfmcodhgaoodhemkeempcihlcbpia",
                          "image": "https://lh3.googleusercontent.com/60bF4ABIQW1E4e6Ru-U_gcIIgMhCpKDbOIbNBOsRzQV-FR_MHKRfpm_7OkLlwlg3islYHnjXzg=s128-h128-e365",
                          "version": "2.2.22",
                          "softwareapplicationcategory": "http://schema.org/OtherApplication",
                          "interactioncount": "UserDownloads:2,908",
                          "operatingsystems": "Chrome",
                          "description": "Easily add candidates and contacts from popular websites directly into the CATS applicant tracking system."
                         },
                         {
                          "name": "CATS Extension",
                          "image": "https://lh3.googleusercontent.com/60bF4ABIQW1E4e6Ru-U_gcIIgMhCpKDbOIbNBOsRzQV-FR_MHKRfpm_7OkLlwlg3islYHnjXzg=s128-h128-e365",
                          "version": "2.2.22",
                          "softwareapplicationcategory": "http://schema.org/OtherApplication",
                          "interactioncount": "UserDownloads:2,908",
                          "operatingsystems": "Chrome",
                          "description": "Easily add candidates and contacts from popular websites directly into the CATS applicant tracking system."
                         }
                        ],
                        "document": [
                         {
                          "page_lang_safe": "en",
                          "item_category": "EXTENSION",
                          "container": "CHROME",
                          "family_unsafe": "false",
                          "user_count": "2908",
                          "supported_regions": "AE,AR,AT,AU,BE,BG,BR,CA,CH,CL",
                          "payment_type": "free",
                          "canonical": "true",
                          "kiosk": "false",
                          "by_google": "false",
                          "works_offline": "false",
                          "available_on_android": "false",
                          "autogen": "false",
                          "stars2": "true",
                          "stars3": "true",
                          "stars4": "true",
                          "stars5": "false",
                          "category": "7_productivity"
                         },
                         {
                          "page_lang_safe": "en",
                          "item_category": "EXTENSION",
                          "container": "CHROME",
                          "family_unsafe": "false",
                          "user_count": "2943",
                          "supported_regions": "AE,AR,AT,AU,BE,BG,BR,CA,CH,CL",
                          "payment_type": "free",
                          "canonical": "true",
                          "kiosk": "false",
                          "by_google": "false",
                          "works_offline": "false",
                          "available_on_android": "false",
                          "autogen": "false",
                          "stars2": "true",
                          "stars3": "true",
                          "stars4": "true",
                          "stars5": "false",
                          "category": "7_productivity",
                          "pagerank_devurl": "42401",
                          "wilson_star_rating": "3.55033934460478",
                          "unpub_user_count": "2943"
                         }
                        ],
                        "aggregaterating": [
                         {
                          "ratingvalue": "4.352941176470588",
                          "ratingcount": "17"
                         },
                         {
                          "ratingvalue": "4.352941176470588",
                          "ratingcount": "17"
                         }
                        ],
                        "metatags": [
                         {
                          "referrer": "origin",
                          "og:title": "CATS Extension",
                          "og:description": "Easily add candidates and contacts from popular websites directly into the CATS applicant tracking system.",
                          "og:type": "website",
                          "og:url": "https://chrome.google.com/webstore/detail/cats-extension/elhkfmcodhgaoodhemkeempcihlcbpia",
                          "og:image": "https://lh3.googleusercontent.com/60bF4ABIQW1E4e6Ru-U_gcIIgMhCpKDbOIbNBOsRzQV-FR_MHKRfpm_7OkLlwlg3islYHnjXzg=s128-h128-e365",
                          "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0"
                         }
                        ],
                        "cse_image": [
                         {
                          "src": "https://lh3.googleusercontent.com/60bF4ABIQW1E4e6Ru-U_gcIIgMhCpKDbOIbNBOsRzQV-FR_MHKRfpm_7OkLlwlg3islYHnjXzg=s128-h128-e365"
                         }
                        ]
                       }
                      },
                      {
                       "kind": "customsearch#result",
                       "title": "Purebred dogs, cats go homeless in Venezuela because owners ...",
                       "htmlTitle": "Purebred dogs, \u003cb\u003ecats\u003c/b\u003e go homeless in Venezuela because owners ...",
                       "link": "http://feedproxy.google.com/~r/latino_foxnews_com/home/feed/~3/KhuPs8nWhwM/",
                       "displayLink": "feedproxy.google.com",
                       "snippet": "1 day ago ... Since the beginning of the year, dozens of pedigree dogs and cats are seen \nwandering on streets and public spaces because their owners ...",
                       "htmlSnippet": "1 day ago \u003cb\u003e...\u003c/b\u003e Since the beginning of the year, dozens of pedigree dogs and \u003cb\u003ecats\u003c/b\u003e are seen \u003cbr\u003e\nwandering on streets and public spaces because their owners&nbsp;...",
                       "cacheId": "YmZc3oYM3vgJ",
                       "formattedUrl": "feedproxy.google.com/~r/latino_foxnews.../KhuPs8nWhwM/",
                       "htmlFormattedUrl": "feedproxy.google.com/~r/latino_foxnews.../KhuPs8nWhwM/",
                       "pagemap": {
                        "cse_thumbnail": [
                         {
                          "width": "209",
                          "height": "241",
                          "src": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR-9UAIKU6ozSQkbP3r14ndqCiDr2N6-vY3QC1nVr6OPX3pw754H_8M8dg"
                         }
                        ],
                        "person": [
                         {
                          "name": "Franz von Bergen",
                          "url": "Franz von Bergen"
                         }
                        ],
                        "organization": [
                         {
                          "name": "Fox News Latino"
                         },
                         {
                          "name": "2013 FOX News Network, LLC. All rights reserved.",
                          "email": "newsmanager@foxnews.com",
                          "image": "global.fncstatic.com/static/v/fn-latino/img/logo-latino.jpg"
                         }
                        ],
                        "metatags": [
                         {
                          "dc.title": "Purebred dogs, cats go homeless in Venezuela because owners can't afford  them",
                          "dc.creator": "Franz von Bergen",
                          "dc.description": "Since the beginning of the year, dozens of pedigree dogs and cats are seen wandering on streets and public spaces because their owners simply cannot afford them.",
                          "dcterms.abstract": "Since the beginning of the year, dozens of pedigree dogs and cats are seen wandering on streets and public spaces because their owners simply cannot afford them.",
                          "dc.publisher": "Fox News Latino",
                          "dc.source": "Fox News Latino",
                          "dc.date": "2016-07-29",
                          "dcterms.created": "2016-07-29 14:12:56 EDT",
                          "dcterms.modified": "2016-07-29 14:12:56 EDT",
                          "dc.type": "Text.Article",
                          "dc.identifier": "urn:uuid:0f8db785f7736510VgnVCM100000d7c1a8c0RCRD",
                          "prism.aggregationtype": "front",
                          "prism.channel": "fnl",
                          "prism.section": "lifestyle",
                          "og:title": "Purebred dogs, cats go homeless in Venezuela because owners can't afford  them",
                          "og:description": "Since the beginning of the year, dozens of pedigree dogs and cats are seen wandering on streets and public spaces because their owners simply cannot afford them.",
                          "og:type": "article",
                          "og:image": "http://a57.foxnews.com/global.fncstatic.com/static/managed/img/fn-latino/entertainment/0/0/cocker.jpg",
                          "og:url": "http://latino.foxnews.com/latino/lifestyle/2016/07/29/venezuela-house-pets-go-homeless-as-owners-cant-afford-them-anymore/",
                          "og:site_name": "Fox News Latino",
                          "fb:app_id": "155493694485141",
                          "pagetype": "article",
                          "classification": "LANGUAGES/English",
                          "twitter:card": "summary_large_image",
                          "twitter:site": "@foxnewslatino",
                          "twitter:image": "http://a57.foxnews.com/global.fncstatic.com/static/managed/img/fn-latino/entertainment/0/0/cocker.jpg?ve=1&tl=1",
                          "twitter:creator": "@foxnewslatino",
                          "parsely-page": "{\"title\":\"Purebred dogs, cats go homeless in Venezuela because owners can\\u0027t afford  them\",\"link\":\"http://latino.foxnews.com/latino/lifestyle/2016/07/29/venezuela-house-pets-go-homeless-as-owners-cant-afford-them-anymore/\",\"image_url\":\"http://global.fncstatic.com/static/v/all/img/fn_latino_128x128.png\",\"type\":\"article\",\"post_id\":\"0f8db785f7736510VgnVCM100000d7c1a8c0RCRD\",\"section\":\"lifestyle\",\"pub_date\":\"2016-07-29T18:12:56Z\",\"author\":\"Franz von Bergen\",\"tags\":[\"LANGUAGES/English\"]}",
                          "parsely-metadata": "{\"title\":\"Purebred dogs, cats go homeless in Venezuela because owners can\\u0027t afford  them\",\"link\":\"http://latino.foxnews.com/latino/lifestyle/2016/07/29/venezuela-house-pets-go-homeless-as-owners-cant-afford-them-anymore/\",\"image_url\":\"http://global.fncstatic.com/static/v/all/img/fn_latino_128x128.png\",\"type\":\"article\",\"identifier\":\"0f8db785f7736510VgnVCM100000d7c1a8c0RCRD\",\"section\":\"lifestyle\",\"pub_date\":\"2016-07-29T18:12:56Z\",\"author\":\"Franz von Bergen\",\"tags\":[\"LANGUAGES/English\"]}",
                          "dc.format": "text/html",
                          "dc.language": "en-US"
                         }
                        ],
                        "itemlist": [
                         {
                          "itemlistelement": "Boxer Paulie Malignaggi -- UFC Getting It Right On Doping ... BOXING Needs A Clean Up (VIDEO)",
                          "description": "The UFC is cracking down on PED usage in a way boxing DESPERATELY needs ... that's according to former boxing World Champ Paulie Malignaggi ... who says it's HIS sport that needs a scrubbing...."
                         },
                         {
                          "itemlistelement": "Did Tyler Posey Just Come Out as Gay?",
                          "description": "Tyler Posey may have just come out as gay in a video posted on social media."
                         },
                         {
                          "itemlistelement": "Amazon bate récords con sus últimos resultados económicos",
                          "datepublished": "2016-07-30T02:15:07Z",
                          "description": "El negocio está en auge en el imperio minorista que ha construido Jeff Bezos. Amazon ha logrado superar incluso las expectativas más altas de Wall Street en su último trimestre fiscal. Ha..."
                         }
                        ],
                        "cse_image": [
                         {
                          "src": "http://a57.foxnews.com/global.fncstatic.com/static/managed/img/fn-latino/entertainment/0/0/cocker.jpg"
                         }
                        ],
                        "newsarticle": [
                         {
                          "description": "Since the beginning of the year, dozens of pedigree dogs and cats are seen wandering on streets and public spaces because their owners simply cannot afford them.",
                          "name": "Purebred dogs, cats go homeless in Venezuela because owners can't afford them",
                          "datepublished": "2016-07-29T14:12-04:00",
                          "articlebody": "Caracas, Venezuela – House pets have become the latest victims of Venezuela’s acute economic crisis. Since the beginning of the year, more and more pedigree dogs and cats have been seen...",
                          "contributor": "Franz von Bergen is a freelancer reporter living in Caracas."
                         }
                        ],
                        "mediaobject": [
                         {
                          "image": "http://a57.foxnews.com/global.fncstatic.com/static/managed/img/fn-latino/entertainment/660/371/cocker.jpg?ve=1&tl=1"
                         }
                        ]
                       }
                      },
                      {
                       "kind": "customsearch#result",
                       "title": "My Cats New Tab - Chrome Web Store",
                       "htmlTitle": "My \u003cb\u003eCats\u003c/b\u003e New Tab - Chrome Web Store",
                       "link": "https://chrome.google.com/webstore/detail/my-cats-new-tab/gamgcdlfhmmigjmbffodgkpglbnejkjm",
                       "displayLink": "chrome.google.com",
                       "snippet": "Customize your New Tab page and enjoy wallpaper images of cats and kittens \nwith every new tab with My Cats for Chrome.",
                       "htmlSnippet": "Customize your New Tab page and enjoy wallpaper images of \u003cb\u003ecats\u003c/b\u003e and kittens \u003cbr\u003e\nwith every new tab with My \u003cb\u003eCats\u003c/b\u003e for Chrome.",
                       "cacheId": "xBUV_4oldQ4J",
                       "formattedUrl": "https://chrome.google.com/...cats.../gamgcdlfhmmigjmbffodgkpglbnejkjm",
                       "htmlFormattedUrl": "https://chrome.google.com/...\u003cb\u003ecats\u003c/b\u003e.../gamgcdlfhmmigjmbffodgkpglbnejkjm",
                       "pagemap": {
                        "offer": [
                         {
                          "price": "$0",
                          "pricecurrency": "USD",
                          "availability": "http://schema.org/InStock"
                         },
                         {
                          "price": "$0",
                          "pricecurrency": "USD",
                          "availability": "http://schema.org/InStock"
                         }
                        ],
                        "cse_thumbnail": [
                         {
                          "width": "102",
                          "height": "102",
                          "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvVNQDJkeNvSjF0JNq9D0p7Z1Fvg0fEpfxmzId_9cZMgFtlKCd5lC58w"
                         }
                        ],
                        "webapplication": [
                         {
                          "name": "My Cats New Tab",
                          "url": "https://chrome.google.com/webstore/detail/my-cats-new-tab/gamgcdlfhmmigjmbffodgkpglbnejkjm",
                          "image": "https://lh3.googleusercontent.com/XPYyXE_l9Ofnp01J6MBJF2pTh0byu64Ruewc0y7O7GT9mrDOC7UoSsXYwp0KBs6VO7GO-5-MpYo=s128-h128-e365",
                          "version": "2.13.15",
                          "softwareapplicationcategory": "http://schema.org/OtherApplication",
                          "interactioncount": "UserDownloads:74,852",
                          "operatingsystems": "Chrome",
                          "description": "Customize your New Tab page and enjoy wallpaper images of cats and kittens with every new tab with My Cats for Chrome."
                         },
                         {
                          "name": "My Cats New Tab",
                          "image": "https://lh3.googleusercontent.com/XPYyXE_l9Ofnp01J6MBJF2pTh0byu64Ruewc0y7O7GT9mrDOC7UoSsXYwp0KBs6VO7GO-5-MpYo=s128-h128-e365",
                          "version": "2.13.15",
                          "softwareapplicationcategory": "http://schema.org/OtherApplication",
                          "interactioncount": "UserDownloads:74,852",
                          "operatingsystems": "Chrome",
                          "description": "Customize your New Tab page and enjoy wallpaper images of cats and kittens with every new tab with My Cats for Chrome."
                         }
                        ],
                        "document": [
                         {
                          "page_lang_safe": "en",
                          "item_category": "EXTENSION",
                          "container": "CHROME",
                          "family_unsafe": "false",
                          "user_count": "74852",
                          "supported_regions": "AE,AR,AT,AU,BE,BG,BR,CA,CH,CL",
                          "payment_type": "free",
                          "canonical": "true",
                          "kiosk": "false",
                          "by_google": "false",
                          "works_offline": "true",
                          "available_on_android": "false",
                          "autogen": "false",
                          "stars2": "true",
                          "stars3": "true",
                          "stars4": "true",
                          "stars5": "false",
                          "category": "28_photos"
                         },
                         {
                          "page_lang_safe": "en",
                          "item_category": "EXTENSION",
                          "container": "CHROME",
                          "family_unsafe": "false",
                          "user_count": "75350",
                          "supported_regions": "AE,AR,AT,AU,BE,BG,BR,CA,CH,CL",
                          "payment_type": "free",
                          "canonical": "true",
                          "kiosk": "false",
                          "by_google": "false",
                          "works_offline": "true",
                          "available_on_android": "false",
                          "autogen": "false",
                          "stars2": "true",
                          "stars3": "true",
                          "stars4": "true",
                          "stars5": "false",
                          "category": "28_photos",
                          "pagerank_devurl": "0",
                          "wilson_star_rating": "4.371671285016792",
                          "unpub_user_count": "75350"
                         }
                        ],
                        "aggregaterating": [
                         {
                          "ratingvalue": "4.543859649122807",
                          "ratingcount": "228"
                         },
                         {
                          "ratingvalue": "4.543859649122807",
                          "ratingcount": "228"
                         }
                        ],
                        "metatags": [
                         {
                          "referrer": "origin",
                          "og:title": "My Cats New Tab",
                          "og:description": "Customize your New Tab page and enjoy wallpaper images of cats and kittens with every new tab with My Cats for Chrome.",
                          "og:type": "website",
                          "og:url": "https://chrome.google.com/webstore/detail/my-cats-new-tab/gamgcdlfhmmigjmbffodgkpglbnejkjm",
                          "og:image": "https://lh3.googleusercontent.com/XPYyXE_l9Ofnp01J6MBJF2pTh0byu64Ruewc0y7O7GT9mrDOC7UoSsXYwp0KBs6VO7GO-5-MpYo=s128-h128-e365",
                          "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0"
                         }
                        ],
                        "cse_image": [
                         {
                          "src": "https://lh3.googleusercontent.com/XPYyXE_l9Ofnp01J6MBJF2pTh0byu64Ruewc0y7O7GT9mrDOC7UoSsXYwp0KBs6VO7GO-5-MpYo=s128-h128-e365"
                         }
                        ]
                       }
                      },
                      {
                       "kind": "customsearch#result",
                       "title": "The Difference Between (Dead) Cats and Dogs in Film",
                       "htmlTitle": "The Difference Between (Dead) \u003cb\u003eCats\u003c/b\u003e and Dogs in Film",
                       "link": "http://feedproxy.google.com/~r/nofilmschool/~3/zsTUWBglxu4/difference-between-dead-cats-dogs-in-film",
                       "displayLink": "feedproxy.google.com",
                       "snippet": "8 hours ago ... cats and dogs cinematic deaths old yeller garfield no film school ... them) as a \"a \ncat which is harmed or even killed in the course of a narrative.",
                       "htmlSnippet": "8 hours ago \u003cb\u003e...\u003c/b\u003e \u003cb\u003ecats\u003c/b\u003e and dogs cinematic deaths old yeller garfield no film school ... them) as a &quot;a \u003cbr\u003e\n\u003cb\u003ecat\u003c/b\u003e which is harmed or even killed in the course of a narrative.",
                       "cacheId": "UElf29VjhSoJ",
                       "formattedUrl": "feedproxy.google.com/.../difference-between-dead-cats-dogs-in-film",
                       "htmlFormattedUrl": "feedproxy.google.com/.../difference-between-dead-\u003cb\u003ecats\u003c/b\u003e-dogs-in-film",
                       "pagemap": {
                        "cse_thumbnail": [
                         {
                          "width": "300",
                          "height": "168",
                          "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS7sUvxOVzOhgYzxfMb876fJLfJkKlSd2oQTxWx6Kwpk0JCDJ5MUq_KU8"
                         }
                        ],
                        "metatags": [
                         {
                          "viewport": "width=device-width, initial-scale=1, maximum-scale=1",
                          "og:type": "article",
                          "og:site_name": "No Film School",
                          "og:url": "http://nofilmschool.com/2016/07/difference-between-dead-cats-dogs-in-film",
                          "twitter:site": "@nofilmschool",
                          "twitter:image": "http://nofilmschool.com/sites/default/files/styles/twitter/public/milo_and_otis.jpg?itok=rbCtBh1B",
                          "og:image": "http://nofilmschool.com/sites/default/files/styles/facebook/public/milo_and_otis.jpg?itok=3k7cFuOR",
                          "twitter:url": "http://nofilmschool.com/2016/07/difference-between-dead-cats-dogs-in-film",
                          "og:title": "The Difference Between (Dead) Cats and Dogs in Film",
                          "og:description": "There is a famous double standard in cinema, but it's not the one you're thinking of. ",
                          "twitter:card": "summary",
                          "twitter:title": "The Difference Between (Dead) Cats and Dogs in Film",
                          "twitter:description": "There is a famous double standard in cinema, but it's not the one you're thinking of. "
                         }
                        ],
                        "cse_image": [
                         {
                          "src": "http://nofilmschool.com/sites/default/files/styles/facebook/public/milo_and_otis.jpg?itok=3k7cFuOR"
                         }
                        ]
                       }
                      },
                      {
                       "kind": "customsearch#result",
                       "title": "The Battle Cats - Android Apps on Google Play",
                       "htmlTitle": "The Battle \u003cb\u003eCats\u003c/b\u003e - Android Apps on Google Play",
                       "link": "https://play.google.com/store/apps/details?id=jp.co.ponos.battlecatsen",
                       "displayLink": "play.google.com",
                       "snippet": "Weirdly Cute Cats (?) rampage across the world! Assist the Cats with extremely \nsimple controls and a straight-forward system! No need to register ...",
                       "htmlSnippet": "Weirdly Cute \u003cb\u003eCats\u003c/b\u003e (?) rampage across the world! Assist the \u003cb\u003eCats\u003c/b\u003e with extremely \u003cbr\u003e\nsimple controls and a straight-forward system! No need to register&nbsp;...",
                       "cacheId": "0cyytUlCI7wJ",
                       "formattedUrl": "https://play.google.com/store/apps/details?id=jp.co...battlecatsen",
                       "htmlFormattedUrl": "https://play.google.com/store/apps/details?id=jp.co...battle\u003cb\u003ecats\u003c/b\u003een",
                       "pagemap": {
                        "offer": [
                         {
                          "url": "https://play.google.com/store/apps/details?id=jp.co.ponos.battlecatsen&rdid=jp.co.ponos.battlecatsen&rdot=1&feature=md",
                          "price": "0"
                         }
                        ],
                        "cse_thumbnail": [
                         {
                          "width": "259",
                          "height": "194",
                          "src": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRLVi_X1urmKHAfozz3EOHfhRRf-OW3EmfTMp2OdXkt0H1wTC22BThAvpI"
                         }
                        ],
                        "mobileapplication": [
                         {
                          "url": "https://play.google.com/store/apps/details?id=jp.co.ponos.battlecatsen",
                          "image": "https://lh3.googleusercontent.com/WjEd_6pXdTC-HT47c_n2BJ-cwBRBA0NBLmN7pXkh_xFU71zUOgCaPRwO-D4ZhXshxg=w300",
                          "topdeveloperbadgeurl": "https://www.gstatic.com/android/market_images/badges/topdev_ann.png",
                          "name": "The Battle Cats",
                          "screenshot": "https://lh3.googleusercontent.com/QBaf5dgU5XGzYmXzqKZD-qktaw2SDWFvzSWdUxYa4rL_CcoIugExVw5CmiUstXSblMw=h310",
                          "description": "★★★Weirdly Cute Cats (?) rampage across the world! ★★★ Assist the Cats with extremely simple controls and a straight-forward system! No need to register to raise your own Battle...",
                          "datepublished": "July 28, 2016",
                          "numdownloads": "1,000,000 - 5,000,000",
                          "operatingsystems": "4.0 and up",
                          "contentrating": "Teen"
                         }
                        ],
                        "organization": [
                         {
                          "url": "/store/apps/dev?id=5525924818463575153",
                          "name": "PONOS",
                          "genre": "Casual"
                         },
                         {
                          "name": "Android"
                         }
                        ],
                        "aggregaterating": [
                         {
                          "ratingvalue": "4.313460350036621",
                          "ratingcount": "107500"
                         }
                        ],
                        "metatags": [
                         {
                          "og:type": "website",
                          "og:title": "The Battle Cats - Android Apps on Google Play",
                          "og:url": "https://play.google.com/store/apps/details?id=jp.co.ponos.battlecatsen"
                         }
                        ],
                        "cse_image": [
                         {
                          "src": "https://i.ytimg.com/vi/nsG8ntX15zU/hqdefault.jpg"
                         }
                        ]
                       }
                      },
                      {
                       "kind": "customsearch#result",
                       "title": "Deadly outbreak at Hayward animal shelter prompts cat quarantine ...",
                       "htmlTitle": "Deadly outbreak at Hayward animal shelter prompts \u003cb\u003ecat\u003c/b\u003e quarantine ...",
                       "link": "http://feedproxy.google.com/~r/noticiasdeportes/~3/aP8rz5vTlFs/",
                       "displayLink": "feedproxy.google.com",
                       "snippet": "21 hours ago ... A deadly outbreak at an East Bay animal shelter has lead to a cat quarantine.",
                       "htmlSnippet": "21 hours ago \u003cb\u003e...\u003c/b\u003e A deadly outbreak at an East Bay animal shelter has lead to a \u003cb\u003ecat\u003c/b\u003e quarantine.",
                       "cacheId": "1Cwbt3Jgr8gJ",
                       "formattedUrl": "feedproxy.google.com/~r/noticiasdeportes/~3/aP8rz5vTlFs/",
                       "htmlFormattedUrl": "feedproxy.google.com/~r/noticiasdeportes/~3/aP8rz5vTlFs/",
                       "pagemap": {
                        "hcard": [
                         {
                          "fn": "http://abc7news.com/about/newsteam/katie-marzullo",
                          "title": "Staff",
                          "url": "http://abc7news.com/about/newsteam/katie-marzullo/"
                         }
                        ],
                        "cse_thumbnail": [
                         {
                          "width": "300",
                          "height": "168",
                          "src": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSRLlxBXcEgZw-GbKol0ya-lWaNyKkDPL5LVUxhfKiAi_FPj2-GzJxg3xjB"
                         }
                        ],
                        "imageobject": [
                         {
                          "name": "http://cdn.abclocal.go.com/content/ktrk/images/cms/automation/vod/1448386_1280x720.jpg",
                          "url": "http://cdn.abclocal.go.com/content/ktrk/images/cms/automation/vod/1448386_1280x720.jpg",
                          "contenturl": "http://cdn.abclocal.go.com/content/ktrk/images/cms/automation/vod/1448386_1280x720.jpg",
                          "headline": "Thieves accidentally save dog from hot car",
                          "caption": "Thieves accidentally save dog from hot car",
                          "text": "Thieves accidentally save dog from hot car",
                          "description": "It may have been just an accident, but four thieves may have also saved a dog's life from a hot truck."
                         },
                         {
                          "name": "http://cdn.abclocal.go.com/content/kgo/images/cms/1448989_1280x720.jpg",
                          "url": "http://cdn.abclocal.go.com/content/kgo/images/cms/1448989_1280x720.jpg",
                          "contenturl": "http://cdn.abclocal.go.com/content/kgo/images/cms/1448989_1280x720.jpg",
                          "headline": "Meet this week's Perfect Pet",
                          "caption": "Meet this week's Perfect Pet",
                          "text": "Meet this week's Perfect Pet",
                          "description": "Meet Bali from the Friends of the Alameda Animal Shelter."
                         },
                         {
                          "name": "http://cdn.abclocal.go.com/content/kgo/images/cms/automation/vod/1448827_1280x720.jpg",
                          "url": "http://cdn.abclocal.go.com/content/kgo/images/cms/automation/vod/1448827_1280x720.jpg",
                          "contenturl": "http://cdn.abclocal.go.com/content/kgo/images/cms/automation/vod/1448827_1280x720.jpg",
                          "headline": "California State Prison in Lancaster takes in animal evacuees after Sand Fire",
                          "caption": "California State Prison in Lancaster takes in animal evacuees after Sand Fire",
                          "text": "California State Prison in Lancaster takes in animal evacuees after Sand Fire",
                          "description": "The California State Prison in Lancaster took in 50 animals that were evacuated from The Deaf Dog Rescue of America in Acton after their community was threatened by the Sand Fire."
                         },
                         {
                          "name": "http://cdn.abclocal.go.com/content/wabc/images/cms/1441970_1280x720.jpg",
                          "url": "http://cdn.abclocal.go.com/content/wabc/images/cms/1441970_1280x720.jpg",
                          "contenturl": "http://cdn.abclocal.go.com/content/wabc/images/cms/1441970_1280x720.jpg",
                          "headline": "Dogs rescued from scorching hot tar roof in New Jersey",
                          "caption": "Dogs rescued from scorching hot tar roof in New Jersey",
                          "text": "Dogs rescued from scorching hot tar roof in New Jersey",
                          "description": "On one of the hottest days of the year, the Associated Humane Society of Newark received a distressing call about two dogs on a tarred rooftop and what they found was heartbreaking."
                         },
                         {
                          "name": "http://cdn.abclocal.go.com/content/kgo/images/cms/1450420_1280x720.jpg",
                          "url": "http://cdn.abclocal.go.com/content/kgo/images/cms/1450420_1280x720.jpg",
                          "contenturl": "http://cdn.abclocal.go.com/content/kgo/images/cms/1450420_1280x720.jpg",
                          "headline": "Walnut Creek BART station remains closed after fire on track",
                          "caption": "Walnut Creek BART station remains closed after fire on track",
                          "text": "Walnut Creek BART station remains closed after fire on track",
                          "description": "This image shows a firefighter with the Contra Costa Fire Protection District putting out a track fire at the Walnut Creek station on July 30, 2016."
                         },
                         {
                          "name": "http://cdn.abclocal.go.com/content/kgo/images/cms/1450186_1280x720.jpg",
                          "url": "http://cdn.abclocal.go.com/content/kgo/images/cms/1450186_1280x720.jpg",
                          "contenturl": "http://cdn.abclocal.go.com/content/kgo/images/cms/1450186_1280x720.jpg",
                          "headline": "Hot air balloon crash kills at least 16 people near Austin",
                          "caption": "Hot air balloon crash kills at least 16 people near Austin",
                          "text": "Hot air balloon crash kills at least 16 people near Austin",
                          "description": "Police cars block access to the site where a hot air balloon crashed early Saturday, July 30, 2016, near Lockhart, Texas."
                         },
                         {
                          "name": "http://cdn.abclocal.go.com/content/kgo/images/cms/automation/vod/1438131_1280x720.jpg",
                          "url": "http://cdn.abclocal.go.com/content/kgo/images/cms/automation/vod/1438131_1280x720.jpg",
                          "contenturl": "http://cdn.abclocal.go.com/content/kgo/images/cms/automation/vod/1438131_1280x720.jpg",
                          "headline": "Trump, Clinton spar for national security upper hand",
                          "caption": "Trump, Clinton spar for national security upper hand",
                          "text": "Trump, Clinton spar for national security upper hand",
                          "description": "With the last week belonging to the Republicans, Hillary Clinton's camp is gearing up to take the spotlight."
                         },
                         {
                          "name": "http://cdn.abclocal.go.com/content/kgo/images/cms/1450366_1280x720.jpg",
                          "url": "http://cdn.abclocal.go.com/content/kgo/images/cms/1450366_1280x720.jpg",
                          "contenturl": "http://cdn.abclocal.go.com/content/kgo/images/cms/1450366_1280x720.jpg",
                          "headline": "Donald Trump attacks Muslim father's convention speech",
                          "caption": "Donald Trump attacks Muslim father's convention speech",
                          "text": "Donald Trump attacks Muslim father's convention speech",
                          "description": "Republican presidential candidate Donald Trump speaks during a campaign rally, Friday, July 29, 2016, in Colorado Springs, Colo."
                         },
                         {
                          "name": "http://cdn.abclocal.go.com/content/kgo/images/cms/automation/vod/1449841_1280x720.jpg",
                          "url": "http://cdn.abclocal.go.com/content/kgo/images/cms/automation/vod/1449841_1280x720.jpg",
                          "contenturl": "http://cdn.abclocal.go.com/content/kgo/images/cms/automation/vod/1449841_1280x720.jpg",
                          "headline": "Family searching for driver in deadly hit-and-run in Concord",
                          "caption": "Family searching for driver in deadly hit-and-run in Concord",
                          "text": "Family searching for driver in deadly hit-and-run in Concord",
                          "description": "A deadly hit-and-run has left a Bay Area family devastated and police looking for the driver."
                         },
                         {
                          "name": "http://cdn.abclocal.go.com/content/kgo/images/cms/1449633_1280x720.jpg",
                          "url": "http://cdn.abclocal.go.com/content/kgo/images/cms/1449633_1280x720.jpg",
                          "contenturl": "http://cdn.abclocal.go.com/content/kgo/images/cms/1449633_1280x720.jpg",
                          "headline": "ONLY ON ABC7NEWS.COM: Exonerated Lake County man now on death bed waiting for check from California",
                          "caption": "ONLY ON ABC7NEWS.COM: Exonerated Lake County man now on death bed waiting for check from California",
                          "text": "ONLY ON ABC7NEWS.COM: Exonerated Lake County man now on death bed waiting for check from California",
                          "description": "Luther Jones spent 18 years in prison for a crime he didn't commit. Exonerated earlier this year, the 72-year-old left prison and fell ill. Now, the clock is ticking as he awaits nearly $1..."
                         },
                         {
                          "name": "http://cdn.abclocal.go.com/content/ktrk/images/cms/automation/vod/1450008_1280x720.jpg",
                          "url": "http://cdn.abclocal.go.com/content/ktrk/images/cms/automation/vod/1450008_1280x720.jpg",
                          "contenturl": "http://cdn.abclocal.go.com/content/ktrk/images/cms/automation/vod/1450008_1280x720.jpg",
                          "headline": "Taco Bell investigating reports of employees taunting police officer",
                          "caption": "Taco Bell investigating reports of employees taunting police officer",
                          "text": "Taco Bell investigating reports of employees taunting police officer",
                          "description": "Taco Bell servers allegedly taunt officer with pig noises"
                         },
                         {
                          "name": "http://cdn.abclocal.go.com/content/kgo/images/cms/1449524_1280x720.jpg",
                          "url": "http://cdn.abclocal.go.com/content/kgo/images/cms/1449524_1280x720.jpg",
                          "contenturl": "http://cdn.abclocal.go.com/content/kgo/images/cms/1449524_1280x720.jpg",
                          "headline": "Source: Alameda Co. Sheriff's deputy in beating, bribery case fired",
                          "caption": "Source: Alameda Co. Sheriff's deputy in beating, bribery case fired",
                          "text": "Source: Alameda Co. Sheriff's deputy in beating, bribery case fired",
                          "description": "ABC7 News was first to report that a Alameda County Sheriff's deputy who's being investigated in connection with bribing a couple that witnessed a November alleyway beating no longer works..."
                         }
                        ],
                        "person": [
                         {
                          "org": "ABC7 San Francisco",
                          "role": "Staff"
                         },
                         {
                          "url": "http://abc7news.com/about/newsteam/katie-marzullo/",
                          "affiliation": "ABC7 San Francisco",
                          "jobtitle": "Staff",
                          "name": "Katie Marzullo"
                         }
                        ],
                        "organization": [
                         {
                          "url": "http://abc7news.com/",
                          "logo": "http://cdn.abclocal.go.com/assets/news/kgo/images/logos/header-large.png"
                         },
                         {
                          "url": "http://abc7news.com/",
                          "logo": "http://cdn.abclocal.go.com/assets/news/kgo/images/logos/header-large.png"
                         }
                        ],
                        "metatags": [
                         {
                          "viewport": "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
                          "news_keywords": "cat,an leukopenia,distemper,Hayward Animal Services,",
                          "msvalidate.01": "59C39F9AA91BE12CB90B7EF18335463D",
                          "og:locale": "en_US",
                          "og:type": "article",
                          "og:url": "http://abc7news.com/1449798/",
                          "og:title": "Deadly outbreak at Hayward animal shelter prompts cat quarantine",
                          "og:description": "A deadly outbreak at an East Bay animal shelter has lead to a cat quarantine.",
                          "og:image": "http://cdn.abclocal.go.com/content/kgo/images/cms/automation/vod/1449848_1280x720.jpg",
                          "og:site_name": "ABC7 San Francisco",
                          "fb:app_id": "479764485457445",
                          "fb:pages": "57427307078",
                          "article:publisher": "https://facebook.com/abc7news",
                          "author": "Katie Marzullo",
                          "article:author": "https://www.facebook.com/profile.php?id=100003101630011",
                          "article:section": "Pets",
                          "article:tag": "cat,an leukopenia,distemper,Hayward Animal Services,cats,shelter,animal,animal news,illness,hayward,united states,california",
                          "article:published_time": "2016-07-30T05:06:43.000Z",
                          "article:modified_time": "2016-07-30T07:04:15.000Z",
                          "twitter:title": "Deadly outbreak at Hayward animal shelter prompts cat quarantine",
                          "twitter:description": "A deadly outbreak at an East Bay animal shelter has lead to a cat quarantine.",
                          "twitter:card": "summary_large_image",
                          "twitter:image": "http://cdn.abclocal.go.com/content/kgo/images/cms/automation/vod/1449848_1280x720.jpg",
                          "twitter:site": "@abc7newsbayarea",
                          "twitter:creator": "@abc7newsbayarea",
                          "twitter:app:country": "US",
                          "twitter:app:name:iphone": "ABC7 News San Francisco",
                          "twitter:app:id:iphone": "407314068",
                          "twitter:app:url:iphone": "http://itunes.apple.com/us/app/abc7-news-san-francisco/id407314068",
                          "twitter:app:name:ipad": "ABC7 News San Francisco",
                          "twitter:app:id:ipad": "407314068",
                          "twitter:app:url:ipad": "http://itunes.apple.com/us/app/abc7-news-san-francisco/id407314068",
                          "twitter:app:name:googleplay": "ABC7 News San Francisco",
                          "twitter:app:id:googleplay": "com.abclocal.kgo.news",
                          "twitter:app:url:googleplay": "https://play.google.com/store/apps/details?id=com.abclocal.kgo.news"
                         }
                        ],
                        "videoobject": [
                         {
                          "name": "Deadly outbreak at Hayward animal shelter prompts cat quarantine",
                          "description": "A deadly outbreak at an East Bay animal shelter has lead to a cat quarantine. (KGO-TV)",
                          "thumbnailurl": "http://cdn.abclocal.go.com/content/kgo/images/cms/automation/vod/1449848.jpg",
                          "contenturl": "http://content.uplynk.com/ext/4413701bf5a1488db55b767f8ae9d4fa/072916-kgo-sick-cat-vid_web.m3u8?ad._v=2&ad=kgo_video&ad.preroll=&ad.fill_slate=1&ad.ametr=1"
                         }
                        ],
                        "cse_image": [
                         {
                          "src": "http://cdn.abclocal.go.com/content/kgo/images/cms/automation/vod/1449848_630x354.jpg"
                         }
                        ]
                       }
                      },
                      {
                       "kind": "customsearch#result",
                       "title": "Cookie Cats - Android Apps on Google Play",
                       "htmlTitle": "Cookie \u003cb\u003eCats\u003c/b\u003e - Android Apps on Google Play",
                       "link": "https://play.google.com/store/apps/details?id=dk.tactile.cookiecats",
                       "displayLink": "play.google.com",
                       "snippet": "The neighborhood cats are hungry for cookies, and only YOU can help them! \nJoin Belle, Ziggy, Smokey, Rita, Berry and countless other adorable kitties in a ...",
                       "htmlSnippet": "The neighborhood \u003cb\u003ecats\u003c/b\u003e are hungry for cookies, and only YOU can help them! \u003cbr\u003e\nJoin Belle, Ziggy, Smokey, Rita, Berry and countless other adorable kitties in a&nbsp;...",
                       "cacheId": "p_4Us9eUM64J",
                       "formattedUrl": "https://play.google.com/store/apps/details?id=dk.tactile.cookiecats",
                       "htmlFormattedUrl": "https://play.google.com/store/apps/details?id=dk.tactile.cookie\u003cb\u003ecats\u003c/b\u003e",
                       "pagemap": {
                        "offer": [
                         {
                          "url": "https://play.google.com/store/apps/details?id=dk.tactile.cookiecats&rdid=dk.tactile.cookiecats&rdot=1&feature=md",
                          "price": "0"
                         }
                        ],
                        "cse_thumbnail": [
                         {
                          "width": "139",
                          "height": "248",
                          "src": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQNhbiOy9uVRQ5z4M7STyrt_MISiteFIjXTdQPqU0EYMM-9h1fvgrjOLGk"
                         }
                        ],
                        "mobileapplication": [
                         {
                          "url": "https://play.google.com/store/apps/details?id=dk.tactile.cookiecats",
                          "image": "https://lh3.googleusercontent.com/tiip9m9ky7IXmfeAWQLdkf-0nuzMHDIJoH2lQQb_HdIH9rtog33wNjxdJH_kRMliJg=w300",
                          "topdeveloperbadgeurl": "https://www.gstatic.com/android/market_images/badges/topdev_ann.png",
                          "name": "Cookie Cats",
                          "screenshot": "https://lh3.googleusercontent.com/qFlAhtppFsjIvTSr3pofb6VtXTkMAPn9jWhATrWNUQo4dUt8C43IxNJHDIohdMY2c-CB=h310",
                          "description": "The neighborhood cats are hungry for cookies, and only YOU can help them! Join Belle, Ziggy, Smokey, Rita, Berry and countless other adorable kitties in a journey through pawsome new places,...",
                          "datepublished": "July 19, 2016",
                          "filesize": "54M",
                          "numdownloads": "1,000,000 - 5,000,000",
                          "softwareversion": "1.3.2",
                          "operatingsystems": "4.0.3 and up",
                          "contentrating": "Everyone"
                         }
                        ],
                        "organization": [
                         {
                          "url": "/store/apps/dev?id=8367752935101364368",
                          "name": "Tactile Entertainment",
                          "genre": "Puzzle"
                         },
                         {
                          "name": "Android"
                         }
                        ],
                        "aggregaterating": [
                         {
                          "ratingvalue": "4.76525354385376",
                          "ratingcount": "43596"
                         }
                        ],
                        "metatags": [
                         {
                          "og:type": "website",
                          "og:title": "Cookie Cats - Android Apps on Google Play",
                          "og:url": "https://play.google.com/store/apps/details?id=dk.tactile.cookiecats"
                         }
                        ],
                        "cse_image": [
                         {
                          "src": "https://lh3.googleusercontent.com/qFlAhtppFsjIvTSr3pofb6VtXTkMAPn9jWhATrWNUQo4dUt8C43IxNJHDIohdMY2c-CB=h310"
                         }
                        ]
                       }
                      },
                      {
                       "kind": "customsearch#result",
                       "title": "Owls are just cats with wings. think about it : aww",
                       "htmlTitle": "Owls are just \u003cb\u003ecats\u003c/b\u003e with wings. think about it : aww",
                       "link": "http://feedproxy.google.com/~r/reddit/BnPw/~3/c2avNrY9zyM/",
                       "displayLink": "feedproxy.google.com",
                       "snippet": "2 days ago ... So Chinese people have already been calling owls \"cat-headed eagles\" for .... \nFitting considering modern domestic cats descend from North ...",
                       "htmlSnippet": "2 days ago \u003cb\u003e...\u003c/b\u003e So Chinese people have already been calling owls &quot;\u003cb\u003ecat\u003c/b\u003e-headed eagles&quot; for .... \u003cbr\u003e\nFitting considering modern domestic \u003cb\u003ecats\u003c/b\u003e descend from North&nbsp;...",
                       "cacheId": "o8wQ-_SGNKsJ",
                       "formattedUrl": "feedproxy.google.com/~r/reddit/BnPw/~3/c2avNrY9zyM/",
                       "htmlFormattedUrl": "feedproxy.google.com/~r/reddit/BnPw/~3/c2avNrY9zyM/",
                       "pagemap": {
                        "cse_thumbnail": [
                         {
                          "width": "225",
                          "height": "225",
                          "src": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTkpUWgYEtsAWn-c73fv7ntxzbDteBlS6LSZQMxm-raqCpLnw9cEM1dVFk"
                         }
                        ],
                        "metatags": [
                         {
                          "referrer": "always",
                          "viewport": "width=1024",
                          "og:image": "http://i.imgur.com/hls96Kv.gif",
                          "og:ttl": "600",
                          "og:site_name": "reddit",
                          "og:description": "5699 points and 820 comments so far on reddit",
                          "og:title": "Owls are just cats with wings. think about it • /r/aww",
                          "twitter:site": "reddit",
                          "twitter:card": "summary",
                          "twitter:title": "Owls are just cats with wings. think about it • /r/aww"
                         }
                        ],
                        "cse_image": [
                         {
                          "src": "http://i.imgur.com/hls96Kv.gif"
                         }
                        ]
                       }
                      },
                      {
                       "kind": "customsearch#result",
                       "title": "Game for Cats - Android Apps on Google Play",
                       "htmlTitle": "Game for \u003cb\u003eCats\u003c/b\u003e - Android Apps on Google Play",
                       "link": "https://play.google.com/store/apps/details?id=com.littlehiccup.GameForCats",
                       "displayLink": "play.google.com",
                       "snippet": "As seen on ANIMAL PLANET's \"Must Love Cats\" == +++++ \"Crazy fun for our cats\n!\" +++++ \"Wow! My kitty loves this game!!! It really works!\" +++++ \"My cats' new ...",
                       "htmlSnippet": "As seen on ANIMAL PLANET&#39;s &quot;Must Love \u003cb\u003eCats\u003c/b\u003e&quot; == +++++ &quot;Crazy fun for our \u003cb\u003ecats\u003c/b\u003e\u003cbr\u003e\n!&quot; +++++ &quot;Wow! My kitty loves this game!!! It really works!&quot; +++++ &quot;My \u003cb\u003ecats\u003c/b\u003e&#39; new&nbsp;...",
                       "cacheId": "BrTLvATRaZYJ",
                       "formattedUrl": "https://play.google.com/store/apps/details?id=com...GameForCats",
                       "htmlFormattedUrl": "https://play.google.com/store/apps/details?id=com...GameFor\u003cb\u003eCats\u003c/b\u003e",
                       "pagemap": {
                        "offer": [
                         {
                          "url": "https://play.google.com/store/apps/details?id=com.littlehiccup.GameForCats&rdid=com.littlehiccup.GameForCats&rdot=1&feature=md",
                          "price": "0"
                         }
                        ],
                        "cse_thumbnail": [
                         {
                          "width": "259",
                          "height": "194",
                          "src": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTuDvPg4dsj2D1lhP36y-5HjCDnI7m86nWj3Ue-N0loYYrXqiOwIygTqmEe"
                         }
                        ],
                        "mobileapplication": [
                         {
                          "url": "https://play.google.com/store/apps/details?id=com.littlehiccup.GameForCats",
                          "image": "https://lh3.googleusercontent.com/KJrAXG0Iv1DooXnHg9f8gCdeB40cyACz_DI1OyqoEVDt3n0T6rtyeUEZa1jP4bBzT5k=w300",
                          "name": "Game for Cats",
                          "screenshot": "https://lh3.googleusercontent.com/84Vle2dDc_w4kT4921bItU3zRucmJLQ0SRS8qOGoHvb5TXj8C_kSa8X6PNVRD1Y26Fc=h310",
                          "description": "== As seen on ANIMAL PLANET's \"Must Love Cats\" ==+++++ \"Crazy fun for our cats!\" +++++ \"Wow! My kitty loves this game!!! It really works!\" +++++ \"My cats' new favorite App!\" +++++ \"My cat loves...",
                          "datepublished": "August 7, 2015",
                          "filesize": "44M",
                          "numdownloads": "50,000 - 100,000",
                          "softwareversion": "2.0.0",
                          "operatingsystems": "3.0 and up",
                          "contentrating": "Everyone 10+"
                         }
                        ],
                        "organization": [
                         {
                          "url": "/store/apps/developer?id=Little+Hiccup",
                          "name": "Little Hiccup",
                          "genre": "Casual"
                         },
                         {
                          "name": "Android"
                         }
                        ],
                        "aggregaterating": [
                         {
                          "ratingvalue": "3.4204323291778564",
                          "ratingcount": "509"
                         }
                        ],
                        "metatags": [
                         {
                          "og:type": "website",
                          "og:title": "Game for Cats - Android Apps on Google Play",
                          "og:url": "https://play.google.com/store/apps/details?id=com.littlehiccup.GameForCats"
                         }
                        ],
                        "cse_image": [
                         {
                          "src": "https://i.ytimg.com/vi/vNbwzx3ehpA/hqdefault.jpg"
                         }
                        ]
                       }
                      }
                     ]
                    }
                }
            ];

            if (err) {
                return done(err);
            }

            results = _.reduce(results, function (mem, res) {
                // validate it was a 200 for concatenating res.body.items;
                if (res.statusCode !== 200) {
                    return mem;
                }

                var results = _.get(res, 'body.items', []);
                return mem.concat(results);
            }, []);

            done(null, results);
        });
    };

    window.lb = _.set(window.lb, 'gapi', gapi);
})();