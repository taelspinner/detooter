// ==UserScript==
// @name         delet this
// @namespace    https://github.com/fariparedes/detooter/
// @author       @fariparedes@yiff.life
// @version      1.0
// @description  just try and fucking stop me
// @include      https://yiff.life/*
// @include      https://mastodon.social/*
// @include      https://chitter.xyz/*
// @include      https://meow.social/*
// @include      https://awoo.space/*
// @include      https://cybre.space/*
// @include      https://dragon.style/*
// @include      https://computerfairi.es/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// ==/UserScript==

function search_and_delet(elem) {
    const spans = $(elem).find("span");
    if(spans.length > 0) {
        spans.each(function(i) {
            delet(this);
        });
    } else {
        delet(elem);
    }
}

function delet(elem) {
    if(elem.innerText.match(/toot/i)) {
        console.log(elem);
        elem.innerText = elem.innerText.replace(/toot/g,"post");
        elem.innerText = elem.innerText.replace(/Toot/g,"Post");
        elem.innerText = elem.innerText.replace(/TOOT/g,"POST");
    }
}

$(document).ready(function() {
    var config = { attributes: true, childList: true, subtree: true };
    var callback = function(mutationsList) {
        for(var mutation of mutationsList) {
            if(mutation.type == "childList") {
                console.log(mutation);
                /* trigger on initial post loading */
                if($(mutation.target).hasClass("item-list")) {
                    $(mutation.target.children).find("p").each(function(i) {
                        search_and_delet(this);
                    });
                /* trigger when a column is dismissed and reloaded */
                } else if($(mutation.target).hasClass("columns-area")) {
                    $(mutation.addedNodes).find("p").each(function(i) {
                        search_and_delet(this);
                    });
                /* trigger when a new post is added to a column, or a post is opened in more detail */
                } else if($(mutation.target).hasClass("status__content") || $(mutation.target).hasClass("detailed-status__wrapper")) {
                    $(mutation.target).find("p").each(function(i) {
                        search_and_delet(this);
                    });
                }
            }
        }
    };
    var observer = new MutationObserver(callback);
    observer.observe(document, config);
    $("button.button--block").text("Doot!");
});
