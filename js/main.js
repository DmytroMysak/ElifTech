'use strict';

window.onload = function LoadFromDb() {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: 'http://eliftechdataapi.azurewebsites.net/companies'
    }).done(function (data) {
        for (var i = 0; i < data.length; ++i) {
            CreateCompany(data[i].id, data[i].name, data[i].price, data[i].parentId);
            PricePlusSubPrice(data[i].id);
        }
        document.getElementById("-1").innerHTML = '<i class="glyphicon glyphicon-plus"/>';
    });
};

var AddOrEditCompany = function AddOrEditCompany(id, addOrEdit) {
    var name = document.getElementById("name").value;
    var price = parseFloat(document.getElementById("price").value, 10);
    document.getElementById("price").style.borderColor = isNaN(price) ? "red" : "green";
    document.getElementById("name").style.borderColor = name == "" ? "red" : "green";
    if (isNaN(price) || name == "") return;
    DeleteIF();

    var request = $.ajax({
        type: addOrEdit === undefined ? 'POST' : 'PUT',
        contentType: 'application/json',
        url: 'http://eliftechdataapi.azurewebsites.net/companies',
        data: JSON.stringify({ 'id': id, 'parentId': id, 'name': name, 'price': price })
    });
    request.done(function (data) {
        addOrEdit === undefined ? CreateCompany(data, name, price, id) : EditCompany(id, name, price);
        PricePlusSubPrice(addOrEdit === undefined ? data : id);
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
};

var DeleteCompany = function DeleteCompany(id) {
    var deleteCompany = document.getElementById(id);
    var parentId = deleteCompany.parentElement.parentElement.id;

    if (deleteCompany.parentElement.id != 'companies') {
        var textCompany = document.getElementsByName(id);
        var sumCompany = parseFloat(textCompany[2].innerHTML, 10);
        var textParent = document.getElementsByName(parentId);
        var sumParent = parseFloat(textParent[2].innerHTML, 10);
        textParent[2].innerHTML = sumParent - sumCompany;
        PricePlusSubPrice(parentId);
    }
    deleteCompany.parentNode.removeChild(deleteCompany);
    $.ajax({
        type: 'DELETE',
        url: 'http://eliftechdataapi.azurewebsites.net/companies/' + id,
        contentType: 'application/json'
    }).fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
};

var DeleteAll = function DeleteAll() {
    var delElem = document.getElementById("companies");
    while (delElem.firstChild) {
        delElem.removeChild(delElem.firstChild);
    }
    $.ajax({
        type: 'DELETE',
        url: 'http://eliftechdataapi.azurewebsites.net/companies/deleteall',
        contentType: 'application/json'
    }).fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
};

var PricePlusSubPrice = function PricePlusSubPrice(id) {
    if (document.getElementById(id).parentElement.id == 'companies') return;
    var parent = document.getElementById(id).parentElement;
    var allChildren = parent.children;
    var textParent = document.getElementsByName(parent.parentElement.id);
    var sum = parseFloat(textParent[1].innerHTML, 10);

    for (var i = 0; i < allChildren.length; ++i) {
        var textChild = document.getElementsByName(allChildren[i].id);
        var childMoney = parseFloat(textChild[2].innerHTML, 10);
        sum += childMoney;
    }
    textParent[2].innerHTML = sum;
    PricePlusSubPrice(parent.parentElement.id);
};

var EditCompany = function EditCompany(id, companyName, price) {
    var companyText = document.getElementsByName(id);
    var oldMoney = parseFloat(companyText[1].innerHTML, 10);
    companyText[0].innerHTML = companyName;
    companyText[1].innerHTML = price;
    companyText[2].innerHTML = parseFloat(companyText[2].innerHTML, 10) - oldMoney + price;
};

var DeleteIF = function DeleteIF() {
    var inputForm = document.getElementById("inputForm");
    inputForm.parentNode.removeChild(inputForm);
};

var CreateIF = function CreateIF(id, addOrEdit) {
    var inputForm = document.getElementById("inputForm");
    if (inputForm) return;

    var element = document.createElement('form');
    element.setAttribute("id", "inputForm");
    element.setAttribute("class", "form-inline");
    element.setAttribute("role", 'form');

    if (id == -1) {
        var mainDiv = document.getElementById("companies");
        mainDiv.insertBefore(element, mainDiv.firstChild);
    } else {
        var mainCompany = document.getElementById("nodes-" + id);
        mainCompany.appendChild(element);
    }

    var node1 = document.createElement('label');
    node1.setAttribute("for", "name");
    node1.innerHTML = "Name";
    element.appendChild(node1);

    var node2 = document.createElement('input');
    node2.setAttribute("id", "name");
    node2.setAttribute("type", "text");
    node2.setAttribute("class", "form-control");
    node2.setAttribute("placeholder", "name");
    element.appendChild(node2);

    var node3 = document.createElement('label');
    node3.setAttribute("for", "price");
    node3.innerHTML = "Price";
    element.appendChild(node3);

    var node4 = document.createElement('input');
    node4.setAttribute("id", "price");
    node4.setAttribute("type", "text");
    node4.setAttribute("class", "form-control");
    node4.setAttribute("placeholder", "price");
    element.appendChild(node4);

    var node5 = document.createElement('button');
    node5.innerHTML = "Submit";
    node5.setAttribute("type", "submit");
    node5.setAttribute("id", id);
    node5.setAttribute("class", "btn btn-default");
    var onclickAttrib = addOrEdit === undefined ? "this.id" : "this.id, \"edit\"";
    node5.setAttribute("onclick", "AddOrEditCompany(" + onclickAttrib + ")");
    element.appendChild(node5);

    var node6 = document.createElement('button');
    node6.innerHTML = "Cancel";
    node6.setAttribute("type", "cancel");
    node6.setAttribute("class", "btn btn-default");
    node6.setAttribute("onclick", "DeleteIF()");
    element.appendChild(node6);
};

var CreateCompany = function CreateCompany(id, name, price, parentId, allPrice) {
    var element = document.createElement('div');
    element.setAttribute("id", id);
    element.setAttribute("class", "company");

    if (parentId == -1) {
        var mainDiv = document.getElementById("companies");
        mainDiv.appendChild(element);
    } else {
        var parentCompany = document.getElementById("nodes-" + parentId);
        parentCompany.appendChild(element);
    }

    var b1 = document.createElement('b');
    b1.setAttribute("id", id);
    b1.setAttribute("name", id);
    b1.setAttribute("class", "name");
    b1.innerHTML = name;
    element.appendChild(b1);

    var b2 = document.createElement('b');
    b2.setAttribute("id", id);
    b2.setAttribute("name", id);
    b2.setAttribute("class", "price");
    b2.innerHTML = price;
    element.appendChild(b2);

    var b3 = document.createElement('b');
    b3.setAttribute("id", id);
    b3.setAttribute("name", id);
    b3.setAttribute("class", "allPrice");
    b3.innerHTML = allPrice === undefined ? price : allPrice;
    element.appendChild(b3);

    var span2 = document.createElement('span');
    span2.setAttribute("class", "companyButtons");
    element.appendChild(span2);

    var divWithNodes = document.createElement('div');
    divWithNodes.setAttribute("class", "nodes");
    divWithNodes.setAttribute("id", "nodes-" + id);
    element.appendChild(divWithNodes);

    var button1 = document.createElement('button');
    button1.setAttribute("type", "button");
    button1.setAttribute("id", id);
    button1.setAttribute("class", "btn btn-default btn-xs");
    button1.setAttribute("onclick", "CreateIF(this.id)");
    span2.appendChild(button1);
    var glyphicon1 = document.createElement('span');
    glyphicon1.setAttribute("class", "glyphicon glyphicon-plus");
    glyphicon1.setAttribute("aria-hidden", "true");
    button1.appendChild(glyphicon1);

    var button2 = document.createElement('button');
    button2.setAttribute("type", "button");
    button2.setAttribute("id", id);
    button2.setAttribute("class", "btn btn-default btn-xs");
    button2.setAttribute("aria-label", "Right Align");
    button2.setAttribute("onclick", "CreateIF(this.id, \"edit\")");
    span2.appendChild(button2);
    var glyphicon2 = document.createElement('span');
    glyphicon2.setAttribute("class", "glyphicon glyphicon-pencil");
    glyphicon2.setAttribute("aria-hidden", "true");
    button2.appendChild(glyphicon2);

    var button3 = document.createElement('button');
    button3.setAttribute("type", "button");
    button3.setAttribute("id", id);
    button3.setAttribute("class", "btn btn-default btn-xs");
    button3.setAttribute("onclick", "DeleteCompany(this.id)");
    span2.appendChild(button3);
    var glyphicon3 = document.createElement('span');
    glyphicon3.setAttribute("class", "glyphicon glyphicon-trash");
    glyphicon3.setAttribute("aria-hidden", "true");
    button3.appendChild(glyphicon3);
};