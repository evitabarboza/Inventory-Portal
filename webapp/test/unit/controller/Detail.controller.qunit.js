sap.ui.define([
    "novamart/distributors/inventoryportal/controller/Detail.controller"
], function (DetailController) {
    "use strict";

    QUnit.module("Detail Controller Validation");

    function createInput(value) {

        return {

            getValue: function () {
                return value;
            },

            setValueState: function () {}

        };

    }

    QUnit.test("All required fields filled", function (assert) {

        var oController = new DetailController();

        var mInputs = {
            inpEditName: createInput("Printer"),
            inpEditCategory: createInput("Office"),
            inpEditSKU: createInput("PR-100"),
            inpEditPrice: createInput("300"),
            inpEditStock: createInput("15")
        };

        oController.byId = function (sId) {
            return mInputs[sId];
        };

        assert.ok(
            oController._validateForm(),
            "Validation passed"
        );

    });

    QUnit.test("Missing product name", function (assert) {

        var oController = new DetailController();

        var mInputs = {
            inpEditName: createInput(""),
            inpEditCategory: createInput("Office"),
            inpEditSKU: createInput("PR-100"),
            inpEditPrice: createInput("300"),
            inpEditStock: createInput("15")
        };

        oController.byId = function (sId) {
            return mInputs[sId];
        };

        assert.notOk(
            oController._validateForm(),
            "Validation failed"
        );

    });

});