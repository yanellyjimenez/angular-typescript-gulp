import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';

class Login implements Person{
	fullName: string;
	constructor(public firstName, public middleInitial, public lastName){
		this.fullName = firstName + " " + middleInitial + " "+lastName;
	}
}


interface Person{
	firstName: string;
        middleInitial: string;
	lastName:  string;
}

function login(person: Person){

    return "Bienvenido"+person.firstName+" "+person.lastName;
}

var user = new Login("MiNombre ", "MiApellidoPaterno", "MiApellidoMaterno");

document.body.innerHTML = login(user);

