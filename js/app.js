(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    if (spollersBlock.classList.contains("_spoller-init")) {
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        spollerClose.classList.remove("_spoller-active");
                        _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                    }
                }));
            }));
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if ("last" === place || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if ("first" === place) {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (void 0 !== parent.children[index]) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if ("min" === this.type) arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return -1;
                    if ("last" === a.place || "first" === b.place) return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if ("first" === a.place || "last" === b.place) return 1;
                        if ("last" === a.place || "first" === b.place) return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    window.onload = function() {
        const burgerButton = document.querySelector(".icon-menu");
        burgerButton.addEventListener("click", (function() {
            const menuList = document.querySelector(".bar-left__list");
            menuList.classList.toggle("_active");
        }));
        let list = document.querySelector(".bar-left__list");
        list.addEventListener("click", (function(event) {
            let target = event.target;
            if (target.classList.contains("link-button")) arrowToggler(target);
        }));
        let column = document.querySelector(".about-footer");
        column.addEventListener("click", (function(event) {
            let target = event.target;
            if (target.classList.contains("about-footer__main-link")) arrowToggler(target);
        }));
        function arrowToggler(elem) {
            elem.classList.toggle("_active");
        }
        const linkButton1 = document.querySelector(".l1");
        linkButton1.addEventListener("click", (function(e) {
            const image = document.querySelector(".panel");
            image.classList.add("_active-panel");
            console.log("done");
            image.src = "img/panel.jpg";
        }));
        const linkButton2 = document.querySelector(".l2");
        linkButton2.addEventListener("click", (function(e) {
            const image = document.querySelector(".panel");
            image.classList.toggle("_active");
            image.src = "img/panel2.jpg";
        }));
        const linkButton3 = document.querySelector(".l3");
        linkButton3.addEventListener("click", (function(e) {
            const image = document.querySelector(".panel");
            image.src = "img/panel3.jpg";
        }));
        const linkButton4 = document.querySelector(".l4");
        linkButton4.addEventListener("click", (function(e) {
            const image = document.querySelector(".panel");
            image.src = "img/panel4.jpg";
        }));
        const linkButton5 = document.querySelector(".l5");
        linkButton5.addEventListener("click", (function(e) {
            const image = document.querySelector(".panel");
            image.src = "img/panel5.jpg";
        }));
        const firstLink = document.querySelector(".first__link");
        firstLink.addEventListener("click", (function() {
            let code = document.querySelector(".code__1");
            code.innerHTML = `<pre class="c-1">\n            <span><b class="const">const</b> spaceCat = event.target.files[0]</span>\n            <span><b class="const">const</b> { data, error } = await supabase</span>\n            <span>.storage</span>\n            <span>.from(<b class="str">'avatars'</b>)</span>\n            <span>.upload(<b class="str">'space-cat.png'</b>, spaceCat)</span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n        </pre>\n        <div id="copy" class="copy cp-1">\n            <img src="img/icons/copy.svg" alt="">\n            <p>Copy</p>\n        </div>\n        <div class="grey"></div>`;
            let resultCopy = "";
            let btnCopy = document.querySelector("#copy");
            btnCopy.addEventListener("click", (function() {
                let code = document.querySelector(".c-1");
                let copyText = code.querySelectorAll("span");
                for (let el of copyText) {
                    let copied = el.innerText;
                    resultCopy += copied + "\n";
                }
                const el = document.createElement("textarea");
                el.value = resultCopy;
                el.setAttribute("readonly", "");
                el.style.position = "absolute";
                el.style.left = "-9999px";
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }));
        }));
        const secondLink = document.querySelector(".second__link");
        secondLink.addEventListener("click", (function() {
            let code = document.querySelector(".code__1");
            code.innerHTML = `<pre class="c-1">\n            <span><b class="const">const</b> spaceCat = event.target.files[0]</span>\n            <span><b class="const">const</b> { data, error } = await supabase</span>\n            <span>.storage</span>\n            <span>.this(<b class="str">'avatars'</b>)</span>\n            <span>.storage(<b class="str">'space-cat.png'</b>, spaceCat)</span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n        </pre>\n        <div id="copy" class="copy cp-1">\n            <img src="img/icons/copy.svg" alt="">\n            <p>Copy</p>\n        </div>\n        <div class="grey"></div>`;
            let resultCopy = "";
            let btnCopy = document.querySelector("#copy");
            btnCopy.addEventListener("click", (function() {
                let code = document.querySelector(".c-1");
                let copyText = code.querySelectorAll("span");
                for (let el of copyText) {
                    let copied = el.innerText;
                    resultCopy += copied + "\n";
                }
                const el = document.createElement("textarea");
                el.value = resultCopy;
                el.setAttribute("readonly", "");
                el.style.position = "absolute";
                el.style.left = "-9999px";
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }));
        }));
        const thirdLink = document.querySelector(".third__link");
        thirdLink.addEventListener("click", (function() {
            let code = document.querySelector(".code__1");
            code.innerHTML = `<pre class="c-1">\n            <span><b class="const">const</b> spaceCat = event.target.files[0]</span>\n            <span><b class="const">const</b> { data, error } = await supabase</span>\n            <span>.storage</span>\n            <span>.this(<b class="str">'avatars'</b>)</span>\n            <span>.list(<b class="str">'space-cat.png'</b>, spaceCat)</span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n        </pre>\n        <div id="copy" class="copy cp-1">\n            <img src="img/icons/copy.svg" alt="">\n            <p>Copy</p>\n        </div>\n        <div class="grey"></div>`;
            let resultCopy = "";
            let btnCopy = document.querySelector("#copy");
            btnCopy.addEventListener("click", (function() {
                let code = document.querySelector(".c-1");
                let copyText = code.querySelectorAll("span");
                for (let el of copyText) {
                    let copied = el.innerText;
                    resultCopy += copied + "\n";
                }
                const el = document.createElement("textarea");
                el.value = resultCopy;
                el.setAttribute("readonly", "");
                el.style.position = "absolute";
                el.style.left = "-9999px";
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }));
        }));
        const forthLink = document.querySelector(".forth__link");
        forthLink.addEventListener("click", (function() {
            let code = document.querySelector(".code__1");
            code.innerHTML = `<pre class="c-1">\n            <span><b class="const">const</b> spaceCat = event.target.files[0]</span>\n            <span><b class="const">const</b> { data, error } = await supabase</span>\n            <span>.storage</span>\n            <span>.this(<b class="str">'avatars'</b>)</span>\n            <span>.move(<b class="str">'space-cat.png'</b>, spaceCat)</span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n        </pre>\n        <div id="copy" class="copy cp-1">\n            <img src="img/icons/copy.svg" alt="">\n            <p>Copy</p>\n        </div>\n        <div class="grey"></div>`;
            let resultCopy = "";
            let btnCopy = document.querySelector("#copy");
            btnCopy.addEventListener("click", (function() {
                let code = document.querySelector(".c-1");
                let copyText = code.querySelectorAll("span");
                for (let el of copyText) {
                    let copied = el.innerText;
                    resultCopy += copied + "\n";
                }
                const el = document.createElement("textarea");
                el.value = resultCopy;
                el.setAttribute("readonly", "");
                el.style.position = "absolute";
                el.style.left = "-9999px";
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }));
        }));
        const fifthLink = document.querySelector(".fifth__link");
        fifthLink.addEventListener("click", (function() {
            let code = document.querySelector(".code__1");
            code.innerHTML = `<pre class="c-1">\n            <span><b class="const">const</b> spaceCat = event.target.files[0]</span>\n            <span><b class="const">const</b> { data, error } = await supabase</span>\n            <span>.storage</span>\n            <span>.this(<b class="str">'avatars'</b>)</span>\n            <span>.delete(<b class="str">'space-cat.png'</b>, spaceCat)</span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n            <span></span>\n        </pre>\n        <div id="copy" class="copy cp-1">\n            <img src="img/icons/copy.svg" alt="">\n            <p>Copy</p>\n        </div>\n        <div class="grey"></div>`;
            let resultCopy = "";
            let btnCopy = document.querySelector("#copy");
            btnCopy.addEventListener("click", (function() {
                let code = document.querySelector(".c-1");
                let copyText = code.querySelectorAll("span");
                for (let el of copyText) {
                    let copied = el.innerText;
                    resultCopy += copied + "\n";
                }
                const el = document.createElement("textarea");
                el.value = resultCopy;
                el.setAttribute("readonly", "");
                el.style.position = "absolute";
                el.style.left = "-9999px";
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }));
        }));
        const nextFirtsLink = document.querySelector(".f__link");
        nextFirtsLink.addEventListener("click", (function() {
            let code = document.querySelector(".code__2");
            code.innerHTML = `\n        <pre class="pre2 c-2">\n            <span><b class="const">create policy</b> <b class="str">"Public Access"</b></span>\n            <span><b class="const">on</b> storage.objects for all</span>\n            <span><b class="const">using</b>(bucket_id = <b class="str">'avatars'</b>);</span>\n            <span></span>\n        </pre>\n        <div id="copy-2" class="copy cp-2">\n            <img src="img/icons/copy.svg" alt="">\n            <p>Copy</p>\n        </div>\n        <div class="grey"></div>\n        `;
            let resCopy = "";
            let btnCopy = document.querySelector("#copy-2");
            btnCopy.addEventListener("click", (function() {
                let code = document.querySelector(".c-2");
                let copyText = code.querySelectorAll("span");
                for (let el of copyText) {
                    let copied = el.innerText;
                    resCopy += copied + "\n";
                }
                const el = document.createElement("textarea");
                el.value = resCopy;
                el.setAttribute("readonly", "");
                el.style.position = "absolute";
                el.style.left = "-9999px";
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }));
        }));
        const nextSecondLink = document.querySelector(".s__link");
        nextSecondLink.addEventListener("click", (function() {
            let code = document.querySelector(".code__2");
            code.innerHTML = `\n        <pre class="pre2 c-2">\n            <span><b class="const">create policy</b> <b class="str">"Public Access"</b></span>\n            <span><b class="const">on</b> storage.objects for all</span>\n            <span><b class="const">using</b>(folder_id = <b class="str">'avatars'</b>);</span>\n            <span></span>\n        </pre>\n        <div id="copy-2" class="copy cp-2">\n            <img src="img/icons/copy.svg" alt="">\n            <p>Copy</p>\n        </div>\n        <div class="grey"></div>\n        `;
            let resCopy = "";
            let btnCopy = document.querySelector("#copy-2");
            btnCopy.addEventListener("click", (function() {
                let code = document.querySelector(".c-2");
                let copyText = code.querySelectorAll("span");
                for (let el of copyText) {
                    let copied = el.innerText;
                    resCopy += copied + "\n";
                }
                const el = document.createElement("textarea");
                el.value = resCopy;
                el.setAttribute("readonly", "");
                el.style.position = "absolute";
                el.style.left = "-9999px";
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }));
        }));
        const nextThirdLink = document.querySelector(".t__link");
        nextThirdLink.addEventListener("click", (function() {
            let code = document.querySelector(".code__2");
            code.innerHTML = `\n        <pre class="pre2 c-2">\n            <span><b class="const">create policy</b> <b class="str">"Authenticated Access"</b></span>\n            <span><b class="const">on</b> storage.objects for all</span>\n            <span><b class="const">using</b>(bucket_id = <b class="str">'avatars'</b>);</span>\n            <span></span>\n        </pre>\n        <div id="copy-2" class="copy cp-2">\n            <img src="img/icons/copy.svg" alt="">\n            <p>Copy</p>\n        </div>\n        <div class="grey"></div>\n        `;
            let resCopy = "";
            let btnCopy = document.querySelector("#copy-2");
            btnCopy.addEventListener("click", (function() {
                let code = document.querySelector(".c-2");
                let copyText = code.querySelectorAll("span");
                for (let el of copyText) {
                    let copied = el.innerText;
                    resCopy += copied + "\n";
                }
                const el = document.createElement("textarea");
                el.value = resCopy;
                el.setAttribute("readonly", "");
                el.style.position = "absolute";
                el.style.left = "-9999px";
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }));
        }));
        let resultCopy = "";
        let btnCopy = document.querySelector("#copy");
        btnCopy.addEventListener("click", (function() {
            let code = document.querySelector(".c-1");
            let copyText = code.querySelectorAll("span");
            for (let el of copyText) {
                let copied = el.innerText;
                resultCopy += copied + "\n";
            }
            const el = document.createElement("textarea");
            el.value = resultCopy;
            el.setAttribute("readonly", "");
            el.style.position = "absolute";
            el.style.left = "-9999px";
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        }));
        let resCopy = "";
        let bCopy = document.querySelector("#copy-2");
        bCopy.addEventListener("click", (function() {
            let code = document.querySelector(".c-2");
            let copyText = code.querySelectorAll("span");
            for (let el of copyText) {
                let copied = el.innerText;
                resCopy += copied + "\n";
            }
            const el = document.createElement("textarea");
            el.value = resCopy;
            el.setAttribute("readonly", "");
            el.style.position = "absolute";
            el.style.left = "-9999px";
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        }));
    };
    window["FLS"] = true;
    isWebp();
    menuInit();
    spollers();
})();