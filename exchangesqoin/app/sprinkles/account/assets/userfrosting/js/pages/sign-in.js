/**
 * Page-specific Javascript file.  Should generally be included as a separate asset bundle in your page template.
 * example: {{ assets.js('js/pages/sign-in-or-register') | raw }}
 *
 * This script depends on validation rules specified in pages/partials/page.js.twig.
 *
 * Target page: account/sign-in
 */
$(document).ready(function() {
    /**
     * If there is a redirect parameter in the query string, redirect to that page.
     * Otherwise, if there is a UF-Redirect header, redirect to that page.
     * Otherwise, redirect to the home page.
     */
    function redirectOnLogin(jqXHR) {
        var components = URI.parse(window.location.href);
        var query = URI.parseQuery(components['query']);

        if (query && query['redirect']) {
            // Strip leading slashes from redirect strings           
            var redirectString = site.uri.public + '/' + query['redirect'].replace(/^\/+/, "");
            // Strip excess trailing slashes for clean URLs. e.g. if redirect=%2F
            redirectString = redirectString.replace(/\/+$/, "/");
            // Redirect
            window.location.replace(redirectString);
        } else if (jqXHR.getResponseHeader('UF-Redirect')) {
            window.location.replace(jqXHR.getResponseHeader('UF-Redirect'));
        } else {
            window.location.replace(site.uri.public);
        }
    }

    $("#sign-in").ufForm({
        validator: page.validators.login,
        msgTarget: $("#alerts-page")
    }).on("submitSuccess.ufForm", function(event, data, textStatus, jqXHR) {

        event.preventDefault();
        var form=$(this);
        var userName = document.getElementById('userName').value;
            var password = document.getElementById('password').value;
        $.ajax({
                url:'/oauth/token',
                type: 'POST',
                contentType: "application/x-www-form-urlencoded",
                //processData: false,
                data: {
                    "grant_type": "password",
                    "username":userName,
                    "password":password
                },
                headers: {"Authorization":"Basic c3FvaW5zcW9pbjpzZWNyZXQ=" },
                success: function (res) {
                    console.log("success" + JSON.stringify(res.access_token));
                    var token=JSON.stringify(res.access_token);
                    var loginToken = token.substring(1, token.length-1);
                      localStorage.setItem('token', loginToken); 

                      redirectOnLogin(jqXHR);
                  },
                error: function () {
                    console.log("false");
                }
            });


        
    });
});
