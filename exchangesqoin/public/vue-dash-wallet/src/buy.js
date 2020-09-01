alert(hi)
var idStorage = localStorage.getItem('id');
//var sagecityURL = "http://localhost:3008";
if (idStorage == '') {
    window.location.href = sagecityURL;
}
$(document).ready(function () {
    console.log("document loaded");
    $('#amount').val(localStorage.getItem('quantity'));
    $('#myCoinInput').val(localStorage.getItem('coin'));
});

var ordersElt = document.getElementById("order-items");
var id;
$.ajax({
    type: 'GET',
   url: sagecityURL + '/userWallet/api/users/current',
     //   url:sagecityURL+'/api2/getUserDetail',
    timeout: 3000,

    success: function (data) {
        id = data.id;
        localStorage.setItem('id', id);
        $("#user__name").append(data.first_name + " " + data.last_name);
        $('#name').val(data.full_name);
        $('#email').val(data.email);
        $('#city').val(data.city);
        $('#address').val(data.address);
        $('#zip').val(data.postcode);
        $('#country').val(data.country);
        $('#full_name').val(data.full_name);

    },
    error: function () {
        console.log("appel false");
    }
});

jQuery.ajax({

    url: sagecityURL + '/api2/getPubAdd?idStorage=' + idStorage,
    type: 'GET',
    contentType: "application/json",

    success: function (pub_add) {
        console.log("success");

        $('#publicKey').val(pub_add);
    },
    error: function () {
        console.log("false");
    }
});


$("#payment-form").submit(function (event) {
    event.preventDefault(); //prevent default action 
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    var form_data = $(this).serializeFormJSON(); //Encode form elements for submission
    var jsonString = JSON.stringify(form_data);

});
var transactionsElt = document.getElementById("transactions_list");
$.ajax({
    type: 'GET',
    url: sagecityURL + '/userWallet/api/users',
    timeout: 3000,
    async: false,
    success: function (data) {

        liste_users = (data.rows);

    },
    error: function () {
        console.log("appel false");
    }
});
function getName(id) {

    for (var i = 0; i < liste_users.length; i++) {
        if (id === liste_users[i].id) {
            return liste_users[i].user_name;
        }

    }
};

if ((idStorage != null) && (idStorage != undefined)) {
    $.ajax({
        type: 'GET',
        url: sagecityURL + '/userWallet/api/transactions',
        timeout: 3000,
        success: function (data) {

            var transactionsArray = JSON.parse(JSON.stringify(data)).rows;
            var limit = 0;
            for (var i = 0; i < transactionsArray.length; i++) {
                if (limit > 3) {
                    return;
                }
                if ((transactionsArray[i].userfrom_id == idStorage) || (transactionsArray[i].userto_id == idStorage)) {
                    var transaction = $("<div class=\"notification__list-item\"> </div>");
                    var p = $("<p> </p>");
                    var span = $("<span class=\"circle\" style=\"background-color: #58a3ea;\"></span>");

                    p.append(span);
                    p.append(getName(transactionsArray[i].userfrom_id) + " to " + getName(transactionsArray[i].userto_id));
                    transaction.append(p);

                    if (transactionsArray[i].amount > 0) {
                        transaction.append("<span class=\"rate rate--plus\" >" + transactionsArray[i].amount + " S</span>");
                    } else {
                        if (transactionsArray[i].amount < -1) {
                            transaction.append("<span class=\"rate rate--pending\" >" + transactionsArray[i].amount + " S</span>");
                        } else {
                            transaction.append("<span class=\"rate rate--minus\" >" + transactionsArray[i].amount + " S</span>");
                        }
                    }
                    $("#notification__list").append(transaction);
                    limit = limit + 1;
                }
            }
        },
        error: function () {
            console.log("appel false");
        }
    });

}


///validation cart
// Create a Stripe client.

$('.popupNw__close').click(function () {
    //window.history.replaceState({}, document.title, "#" + "");
    $('#popupNw').hide();
    $('#processF').hide();
    $('#failF').hide();
    $('#successF').hide();
});

