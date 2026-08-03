sap.ui.define([
    "novamart/distributors/inventoryportal/controller/List.controller"
], function (ListController) {
    "use strict";

    QUnit.module("List Controller Validation");

    function createInput(value) {
        return {
            _state: "",
            _stateText: "",

            getValue: function () {
                return value;
            },

            setValueState: function (state) {
                this._state = state;
            },

            setValueStateText: function (text) {
                this._stateText = text;
            }
        };
    }

    QUnit.test("Valid product data returns true", function (assert) {

        var oController = new ListController();

        var mInputs = {
            inpEditName: createInput("Laptop"),
            inpEditCategory: createInput("Electronics"),
            inpEditSKU: createInput("LAP-100"),
            inpEditPrice: createInput("500"),
            inpEditStock: createInput("25")
        };

        oController.byId = function (sId) {
            return mInputs[sId];
        };

        assert.ok(
            oController._validateForm(),
            "Validation passed"
        );

    });

    QUnit.test("Empty name returns false", function (assert) {

        var oController = new ListController();

        var mInputs = {
            inpEditName: createInput(""),
            inpEditCategory: createInput("Electronics"),
            inpEditSKU: createInput("LAP-100"),
            inpEditPrice: createInput("500"),
            inpEditStock: createInput("25")
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