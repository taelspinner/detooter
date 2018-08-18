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

function delet(elem) {
    elem.textContent = elem.textContent.replace(/toot/g,"post");
    elem.textContent = elem.textContent.replace(/Toot/g,"Post");
    elem.textContent = elem.textContent.replace(/TOOT/g,"POST");
}

$(document).ready(function() {
    var config = { attributes: true, childList: true, subtree: true };
    var callback = function(mutationsList) {
        for(var mutation of mutationsList) {
            if(mutation.type == "childList") {
                if($(mutation.target).hasClass("item-list")) {
                    if(mutation.addedNodes.length > 0) {
                        $(mutation.addedNodes).find("p").each(function(i) {
                            delet(this);
                        });
                    } else {
                        $(mutation.target.children).find("p").each(function(i) {
                            delet(this);
                        });
                    }
                } else if($(mutation.target).hasClass("columns-area")) {
                    $(mutation.addedNodes).find("p").each(function(i) {
                        delet(this);
                    });
                }
            }
        }
    };
    var observer = new MutationObserver(callback);
    observer.observe(document, config);
    $("button.button--block").text("Doot!");
});
