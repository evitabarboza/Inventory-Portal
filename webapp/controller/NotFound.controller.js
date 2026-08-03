sap.ui.define([
    "novamart/distributors/inventoryportal/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("novamart.distributors.inventoryportal.controller.NotFound", {
        onNavBack: function () {
            var oUIModel = this.getOwnerComponent().getModel("ui");
            if (oUIModel) {
                oUIModel.setProperty("/layout", "OneColumn");
            }
            this.getRouter().navTo("master", {}, true);
        }
    });
});