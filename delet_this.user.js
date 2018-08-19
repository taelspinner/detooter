// ==UserScript==
// @name         delet this
// @namespace    https://github.com/fariparedes/detooter/
// @author       @fariparedes@yiff.life
// @version      1.2
// @description  just try and fucking stop me
// @include      https://yiff.life/*
// @include      https://chitter.xyz/*
// @include      https://meow.social/*
// @include      https://awoo.space/*
// @include      https://cybre.space/*
// @include      https://dragon.style/*
// @include      https://scalie.business/*
// @include      https://monsterpit.net/*
// @include      https://sergal.org/*
// @include      https://uwu.st/*
// @include      https://queer.party/*
// @include      https://scalie.club/*
// @include      https://mastodon.social/*
// @include      https://octodon.social/*
// @include      https://mastodon.cloud/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// ==/UserScript==

function get_relevant_elems(div, tag) {
    div.find(tag).each(function(i) {
        search_and_delet(this);
    });
}

function search_and_delet(elem) {
    const spans = $(elem).find("span");
    if(spans.length > 0) {
        search_and_delet(spans);
    }
    /* catch text in posts that have links and emoji */
    $(elem).contents().filter(function() {
        return this.nodeType === 3; //Node.TEXT_NODE
    }).each(function(i) {
        delet(this);
    });
}

function delet(elem) {
    if(elem.data.match(/toot/i)) {
        elem.data = elem.data.replace(/toot/g,"post");
        elem.data = elem.data.replace(/Toot/g,"Post");
        elem.data = elem.data.replace(/TOOT/g,"POST");
    }
}

$(document).ready(function() {
    var config = { attributes: true, childList: true, subtree: true };
    var callback = function(mutationsList) {
        for(var mutation of mutationsList) {
            if(mutation.type == "childList") {
                /* trigger on initial post loading */
                if($(mutation.target).hasClass("item-list")) {
                    get_relevant_elems($(mutation.addedNodes), "p");
                    get_relevant_elems($(mutation.addedNodes), "strong");
                    get_relevant_elems($(mutation.addedNodes), "div.notification__message a"); //fave/boost notif names aren't in strong tags
                    get_relevant_elems($(mutation.target.children), "p");
                    get_relevant_elems($(mutation.target.children), "strong");
                    get_relevant_elems($(mutation.target.children), "div.notification__message a");
                /* trigger when a column is dismissed and reloaded */
                } else if($(mutation.target).hasClass("columns-area")) {
                    get_relevant_elems($(mutation.addedNodes), "p");
                    get_relevant_elems($(mutation.addedNodes), "strong");
                    get_relevant_elems($(mutation.addedNodes), "div.notification__message a");
                /* trigger when a new post is added to a column, or a post is opened in more detail, or someone's profile is opened */
                } else if($(mutation.target).hasClass("status__content") || $(mutation.target).hasClass("detailed-status__wrapper") || $(mutation.target).is("article")) {
                    get_relevant_elems($(mutation.target), "p");
                    get_relevant_elems($(mutation.target), "strong");
                    get_relevant_elems($(mutation.target), "div.notification__message a");
                /* trigger on page refresh */
                } else if(($(mutation.target).hasClass("column")) && mutation.addedNodes.length == 0) {
                    get_relevant_elems($(mutation.target), "p");
                    get_relevant_elems($(mutation.target), "strong");
                    get_relevant_elems($(mutation.target), "div.notification__message a");
                /* trigger on replying to a post or opening one in search */
                } else if($(mutation.target).hasClass("compose-form") || $(mutation.target).hasClass("search-results")) {
                    get_relevant_elems($(mutation.addedNodes), "h5"); //replace the search header too
                    get_relevant_elems($(mutation.addedNodes), "p");
                    get_relevant_elems($(mutation.addedNodes), "strong");
                    get_relevant_elems($(mutation.target), "button"); //when you reply to a post it resets the button
                }
            }
        }
    };
    var observer = new MutationObserver(callback);
    observer.observe(document, config);
    /* replace the button text */
    $("button.button--block").each(function(i) {
       search_and_delet(this);
    });
    /* if a specific status is open, this will catch it */
    $("div.detailed-status__wrapper").find("p").each(function(i) {
       search_and_delet(this);
    });
});
