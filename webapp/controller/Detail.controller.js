sap.ui.define([
    "novamart/distributors/inventoryportal/controller/BaseController",
    "novamart/distributors/inventoryportal/model/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, formatter, Fragment, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("novamart.distributors.inventoryportal.controller.Detail", {

        formatter: formatter,

        onInit: function () {
            this.getRouter()
                .getRoute("detail")
                .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {

            var sProductId = oEvent.getParameter("arguments").productId;
            var oModel = this.getOwnerComponent().getModel("products");
            var oUIModel = this.getOwnerComponent().getModel("ui");

            if (oUIModel) {
                oUIModel.setProperty("/layout", "TwoColumnsMidExpanded");
            }

            var fnBindProduct = function () {

                var aProducts = oModel.getProperty("/products") || [];

                var iIndex = aProducts.findIndex(function (oProduct) {
                    return oProduct.productId === sProductId;
                });

                if (iIndex === -1) {
                    this.getRouter().getTargets().display("notFound");
                    return;
                }

                this.getView().bindElement({
                    path: "/products/" + iIndex,
                    model: "products"
                });

            }.bind(this);

            if (oModel.getProperty("/products")) {
                fnBindProduct();
            } else {
                oModel.attachRequestCompleted(fnBindProduct);
            }

        },


        onEditPress: function () {

            var oContext = this.getView().getBindingContext("products");

            if (!oContext) {
                return;
            }

            if (!this._oEditDialogModel) {
                this._oEditDialogModel = new sap.ui.model.json.JSONModel();
            }

            this._oEditDialogModel.setData({
                title: "Edit Product",
                product: Object.assign({}, oContext.getObject())
            });

            if (!this._pEditDialog) {

                this._pEditDialog = Fragment.load({

                    id: this.getView().getId(),

                    name:
                        "novamart.distributors.inventoryportal.fragment.AddEditProduct",

                    controller: this

                }).then(function (oDialog) {

                    this.getView().addDependent(oDialog);

                    return oDialog;

                }.bind(this));

            }

            this._pEditDialog.then(function (oDialog) {

                oDialog.setModel(
                    this._oEditDialogModel,
                    "dialog"
                );

                oDialog.open();

            }.bind(this));

        },


        onReorderPress: function () {

            var oContext =
                this.getView().getBindingContext("products");

            if (!oContext) {
                return;
            }

            var oModel = oContext.getModel();

            var sPath = oContext.getPath();

            var isStock = oContext.getProperty("stock");

            isStock += 10;

            oModel.setProperty(
                sPath + "/stock",
                isStock
            );

            oModel.setProperty(
                sPath + "/lastUpdated",
                new Date().toISOString().substring(0, 10)
            );

            MessageToast.show(
                isStock + " units reordered successfully!"
            );

        },

        onDeletePress: function () {

            var oContext =
                this.getView().getBindingContext("products");

            if (!oContext) {
                return;
            }

            var iIndex =
                Number(
                    oContext.getPath().split("/").pop()
                );

            var sName =
                oContext.getProperty("name");

            MessageBox.confirm(

                "Delete " + sName + " ?",

                {

                    actions: [
                        MessageBox.Action.DELETE,
                        MessageBox.Action.CANCEL
                    ],

                    emphasizedAction:
                        MessageBox.Action.DELETE,

                    onClose: function (sAction) {

                        if (
                            sAction !==
                            MessageBox.Action.DELETE
                        ) {
                            return;
                        }

                        var oModel =
                            this.getModel("products");

                        var aProducts =
                            oModel.getProperty("/products");

                        aProducts.splice(iIndex, 1);

                        oModel.refresh(true);

                        MessageToast.show(
                            "Product deleted."
                        );

                        this.onCloseDetailPress();

                    }.bind(this)

                }

            );

        },

        onInputChange: function (oEvent) {
            var oInput = oEvent.getSource();
            if (oInput.getValue().trim()) {
                oInput.setValueState("None");
            }
        },


        _validateForm: function () {

            var bValid = true;

            var aFields = [
                {
                    id: "nameEdit",
                    name: "Product Name"
                },
                {
                    id: "categoryEdit",
                    name: "Category"
                },
                {
                    id: "skuEdit",
                    name: "SKU"
                },
                {
                    id: "priceEdit",
                    name: "Price"
                },
                {
                    id: "stockEdit",
                    name: "Stock"
                }
            ];

            aFields.forEach(function (oField) {

                var oInput = Fragment.byId(this.getView().getId(), oField.id);

                if (!oInput) {
                    return;
                }

                var sValue = oInput.getValue().trim();

                // Required field validation
                if (!sValue) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText(oField.name + " is required");
                    bValid = false;
                    return;
                }

                // Price validation
                if (oField.name === "Price") {
                    var fPrice = parseFloat(sValue);

                    if (isNaN(fPrice) || fPrice < 0) {
                        oInput.setValueState("Error");
                        oInput.setValueStateText("Price must be a non-negative number");
                        bValid = false;
                        return;
                    }
                }

                // Stock validation
                if (oField.name === "Stock") {
                    var iStock = parseInt(sValue, 10);

                    if (isNaN(iStock) || iStock < 0) {
                        oInput.setValueState("Error");
                        oInput.setValueStateText("Stock must be a non-negative number");
                        bValid = false;
                        return;
                    }
                }

                oInput.setValueState("None");

            }.bind(this));

            return bValid;
        },

        onSaveProductDialog: function () {

            if (!this._validateForm()) {

                MessageToast.show("Please complete all required fields.");

                return;

            }

            var oProduct =
                this._oEditDialogModel.getProperty("/product");

            oProduct.price = Number(oProduct.price);

            oProduct.stock = Number(oProduct.stock);

            oProduct.reorderThreshold =
                Number(oProduct.reorderThreshold);

            oProduct.lastUpdated =
                new Date().toISOString().substring(0, 10);

            var oContext =
                this.getView().getBindingContext("products");

            this.getModel("products")
                .setProperty(
                    oContext.getPath(),
                    oProduct
                );

            MessageToast.show("Product updated successfully.");

            this._pEditDialog.then(function (oDialog) {

                oDialog.close();

            });

        },


        onCancelProductDialog: function () {

            this._pEditDialog.then(function (oDialog) {

                oDialog.close();

            });

        },


        _resetValidationStates: function () {

            [
                "nameEdit",
                "categoryEdit",
                "skuEdit",
                "priceEdit",
                "stockEdit"
            ].forEach(function (sId) {

                var oInput = Fragment.byId(this.getView().getId(), sId);

                if (oInput) {
                    oInput.setValueState("None");
                }

            }.bind(this));

        },

        onCloseDetailPress: function () {

            var oUIModel = this.getOwnerComponent().getModel("ui");
            if (oUIModel) {
                oUIModel.setProperty("/layout", "OneColumn");
            }
            this.getRouter().navTo("master", {}, true);
        }

    });
});