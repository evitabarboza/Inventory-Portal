sap.ui.define([
    "novamart/distributors/inventoryportal/model/formatter"
], function (formatter) {
    "use strict";

    QUnit.module("Formatter Tests");

    QUnit.test("Stock State - Out of Stock", function (assert) {
        assert.strictEqual(
            formatter.formatStockStatusState(0),
            "Error",
            "Stock 0 returns Error"
        );
    });

    QUnit.test("Stock State - Low Stock", function (assert) {
        assert.strictEqual(
            formatter.formatStockStatusState(5),
            "Warning",
            "Stock <=10 returns Warning"
        );
    });

    QUnit.test("Stock State - Available", function (assert) {
        assert.strictEqual(
            formatter.formatStockStatusState(50),
            "Success",
            "Stock >10 returns Success"
        );
    });

    QUnit.test("Stock Text - Out of Stock", function (assert) {
        assert.strictEqual(
            formatter.formatStockStatusText(0),
            "Out of Stock"
        );
    });

    QUnit.test("Stock Text - Low Stock", function (assert) {
        assert.strictEqual(
            formatter.formatStockStatusText(6),
            "Low Stock"
        );
    });

    QUnit.test("Stock Text - Available", function (assert) {
    assert.strictEqual(
        formatter.formatStockStatusText(20),
        "In Stock",
        "Stock > 10 returns In Stock"
    );
});

});