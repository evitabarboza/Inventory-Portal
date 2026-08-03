sap.ui.define([
    "sap/ui/core/library"
], function (coreLibrary) {
    "use strict";

    var ValueState = coreLibrary.ValueState;

    return {
        formatStockStatusState: function (isStock) {
            if (isStock === undefined || isStock === null) {
                return ValueState.None;
            }

            isStock = parseInt(isStock, 15);

            if (isNaN(isStock)) {
                return ValueState.None;
            }

            if (isStock === 0) {
                return ValueState.Error;    // Red
            } else if (isStock <= 15) {
                return ValueState.Warning;  // Orange
            } else {
                return ValueState.Success;  // Green
            }
        },

        formatStockStatusText: function (isStock) {
            if (isStock === undefined || isStock === null) {
                return "N/A";
            }

            isStock = parseInt(isStock, 15);

            if (isNaN(isStock)) {
                return "Unknown";
            }

            if (isStock === 0) {
                return "Out of Stock";
            } else if (isStock <= 15) {
                return "Low Stock"
            } else {
                return "In Stock";
            }
        },


        formatCurrency: function (fPrice) {
            if (!fPrice || isNaN(fPrice)) {
                return "0.00";
            }
            return parseFloat(fPrice).toFixed(2);
        },

        formatPrice: function (fPrice, sCurrency) {
            if (!fPrice || isNaN(fPrice)) {
                return "$0.00";
            }
            sCurrency = sCurrency || "USD";
            return parseFloat(fPrice).toFixed(2) + " " + sCurrency;
        },

        formatDate: function (sDate) {
            if (!sDate) {
                return "";
            }
            var oDate = new Date(sDate);
            if (isNaN(oDate.getTime())) {
                return sDate;
            }
            return oDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        }


    };
});