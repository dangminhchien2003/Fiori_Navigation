/*global QUnit*/
import Controller from "webapp/controller/Home.controller";

QUnit.module("webapp Controller");

QUnit.test("I should test the webapp controller", function (assert: Assert) {
	const oAppController = new Controller("webapp");
	oAppController.onInit();
	assert.ok(oAppController);
});