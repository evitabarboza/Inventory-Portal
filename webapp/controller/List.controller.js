sap.ui.define([
    "novamart/distributors/inventoryportal/controller/BaseController",
    "novamart/distributors/inventoryportal/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, formatter, Filter, FilterOperator, Sorter, JSONModel, Fragment, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("novamart.distributors.inventoryportal.controller.List", {

        formatter: formatter,


        onInit: function () {

            this._oAddDialogModel = new JSONModel({
                title: "",
                isEdit: false,
                product: {}
            });

            this.getView().setModel(this._oAddDialogModel, "dialog");
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query");
            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                var oFilterName = new Filter("name", FilterOperator.Contains, sQuery);
                var oFilterCategory = new Filter("category", FilterOperator.Contains, sQuery);
                aFilters.push(new Filter({
                    filters: [oFilterName, oFilterCategory],
                    and: false
                }));
            }

            var oList = this.byId("productList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters);
        },

        onProductPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext("products");

            if (!oContext) {
                return;
            }

            var sProductId = oContext.getProperty("productId");

            
            var oUIModel = this.getOwnerComponent().getModel("ui");
            if (oUIModel) {
                oUIModel.setProperty("/layout", "TwoColumnsMidExpanded");
            }

            this.getRouter().navTo("detail", {
                productId: sProductId
            });

            var oTable = this.byId("productList");
        },

        onProductSelect: function (oEvent) {
            var oTable = this.byId("productList");
            var aSelectedItems = oTable.getSelectedItems();

            aSelectedItems.forEach(function (oItem) {
                var oProduct = oItem.getBindingContext("products").getObject();
                console.log(oProduct.name);
            });

            this.byId("buttonEditProduct")
                .setEnabled(aSelectedItems.length === 1);

            this.byId("buttonDeleteProduct")
                .setEnabled(aSelectedItems.length > 0);
        },

        onAddProduct: function () {
            var oView = this.getView();

            this._resetValidationStates();

            if (!this._oAddDialogModel) {
                this._oAddDialogModel = new JSONModel({
                    title: "Add New Product",
                    isEdit: false,
                    product: {
                        productId: "P-" + Math.floor(1000 + Math.random() * 9000),
                        name: "",
                        category: "",
                        sku: "",
                        price: 0,
                        currency: "USD",
                        stock: 0,
                        reorderThreshold: 10,
                        supplier: "",
                        warehouse: "",
                        description: "",
                        lastUpdated: new Date().toISOString().split("T")[0]
                    }
                });
            } else {
                this._oAddDialogModel.setData({
                    title: "Add New Product",
                    isEdit: false,
                    product: {
                        productId: "P-" + Math.floor(1000 + Math.random() * 9000),
                        name: "",
                        category: "",
                        sku: "",
                        price: 0,
                        currency: "USD",
                        stock: 0,
                        reorderThreshold: 10,
                        supplier: "",
                        warehouse: "",
                        description: "",
                        imageUrl: "",
                        lastUpdated: new Date().toISOString().split("T")[0]
                    }
                });
            }

            if (!this._pAddDialog) {
                this._pAddDialog = Fragment.load({
                    id: oView.getId(),
                    name: "novamart.distributors.inventoryportal.fragment.AddEditProduct",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pAddDialog.then(function (oDialog) {
                oDialog.setModel(this._oAddDialogModel, "dialog");
                oDialog.open();
            }.bind(this));
        },

        onInputChange: function (oEvent) {
            var oInput = oEvent.getSource();
            if (oInput.getValue().trim()) {
                oInput.setValueState("None");
            }
        },

        _validateForm: function () {
            var bValid = true;
            var sErrorMsg = "";

            var oInpName = this.byId("inpEditName");
            var oInpCategory = this.byId("inpEditCategory");
            var oInpSKU = this.byId("inpEditSKU");
            var oInpPrice = this.byId("inpEditPrice");
            var oInpStock = this.byId("inpEditStock");

            if (oInpName && (!oInpName.getValue() || !oInpName.getValue().trim())) {
                oInpName.setValueState("Error");
                oInpName.setValueStateText("Product Name is required.");
                if (!sErrorMsg) sErrorMsg = "Product Name is required.";
                bValid = false;
            } else if (oInpName) {
                oInpName.setValueState("None");
            }

            if (oInpCategory && (!oInpCategory.getValue() || !oInpCategory.getValue().trim())) {
                oInpCategory.setValueState("Error");
                oInpCategory.setValueStateText("Category is required.");
                if (!sErrorMsg) sErrorMsg = "Category is required.";
                bValid = false;
            } else if (oInpCategory) {
                oInpCategory.setValueState("None");
            }

            if (oInpSKU && (!oInpSKU.getValue() || !oInpSKU.getValue().trim())) {
                oInpSKU.setValueState("Error");
                oInpSKU.setValueStateText("SKU is required.");
                if (!sErrorMsg) sErrorMsg = "SKU is required.";
                bValid = false;
            } else if (oInpSKU) {
                oInpSKU.setValueState("None");
            }

            if (oInpPrice) {
                var fPrice = parseFloat(oInpPrice.getValue());
                if (isNaN(fPrice) || fPrice < 0) {
                    oInpPrice.setValueState("Error");
                    oInpPrice.setValueStateText("Price cannot be negative or empty.");
                    if (!sErrorMsg) sErrorMsg = "Price must be a valid number >= 0.";
                    bValid = false;
                } else {
                    oInpPrice.setValueState("None");
                }
            }

            if (oInpStock) {
                var isStock = parseInt(oInpStock.getValue(), 10);
                if (isNaN(isStock) || isStock < 0) {
                    oInpStock.setValueState("Error");
                    oInpStock.setValueStateText("Stock quantity cannot be negative or empty.");
                    if (!sErrorMsg) sErrorMsg = "Stock Quantity must be a valid number >= 0.";
                    bValid = false;
                } else {
                    oInpStock.setValueState("None");
                }
            }

            this._sValidationError = sErrorMsg;
            return bValid;
        },

        _resetValidationStates: function () {
            var aInputIds = ["inpEditName", "inpEditCategory", "inpEditSKU", "inpEditPrice", "inpEditStock"];
            aInputIds.forEach(function (sId) {
                var oControl = this.byId(sId);
                if (oControl) {
                    oControl.setValueState("None");
                }
            }.bind(this));
        },

        onEditProduct: function () {

            var oTable = this.byId("productList");
            var aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length !== 1) {
                MessageToast.show("Select one product to edit");
                return;
            }

            var oProduct = aSelectedItems[0]
                .getBindingContext("products")
                .getObject();

            console.log("Editing product:", oProduct);

            this._resetValidationStates();

            this._oAddDialogModel.setData({
                title: "Edit Product",
                isEdit: true,
                product: Object.assign({}, oProduct)
            });

            var oView = this.getView();

            if (!this._pAddDialog) {
                this._pAddDialog = Fragment.load({
                    id: oView.getId(),
                    name: "novamart.distributors.inventoryportal.fragment.AddEditProduct",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pAddDialog.then(function (oDialog) {
                oDialog.setModel(this._oAddDialogModel, "dialog");
                oDialog.open();
            }.bind(this));
        },

        onDeleteProduct: function () {

            var oTable = this.byId("productList");
            var aSelectedItems = oTable.getSelectedItems();

            var oModel = this.getView().getModel("products");
            var aProducts = oModel.getProperty("/products");

            var aIndexes = aSelectedItems.map(function (oItem) {
                return oItem.getBindingContext("products")
                    .getPath()
                    .split("/")
                    .pop();
            });

            aIndexes.sort((a, b) => b - a);

            aIndexes.forEach(function (i) {
                aProducts.splice(i, 1);
            });

            oModel.setProperty("/products", aProducts);

            oTable.removeSelections();

            sap.m.MessageToast.show("Product deleted");
        },

        onSaveProductDialog: function () {
            if (!this._validateForm()) {
                MessageToast.show(this._sValidationError);
                return;
            }

            var oData = this._oAddDialogModel.getProperty("/product");
            oData.price = parseFloat(oData.price);
            oData.stock = parseInt(oData.stock, 10);
            oData.reorderThreshold = parseInt(oData.reorderThreshold, 10) || 0;

            var oProductsModel = this.getModel("products");
            var aProducts = oProductsModel.getProperty("/products") || [];

            if (this._oAddDialogModel.getProperty("/isEdit")) {

                var iIndex = aProducts.findIndex(function (oItem) {
                    return oItem.productId === oData.productId;
                });

                if (iIndex !== -1) {
                    aProducts[iIndex] = oData;
                }

                MessageToast.show("Product updated successfully!");

            } else {

                aProducts.unshift(oData);

                MessageToast.show("New product added successfully!");
            }

            oProductsModel.setProperty("/products", aProducts);

            MessageToast.show("New product added successfully!");

            this._resetValidationStates();
            this._pAddDialog.then(function (oDialog) {
                oDialog.close();
            });
        },

        onCancelProductDialog: function () {
            MessageBox.confirm("Are you sure you want to cancel? Unsaved changes will be lost.", {
                title: "Cancel Action",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        this._resetValidationStates();
                        this._pAddDialog.then(function (oDialog) {
                            oDialog.close();
                        });
                    }
                }.bind(this)
            });
        },

        onOpenViewSettings: function () {
            var oView = this.getView();

            if (!this._pViewSettingsDialog) {
                this._pViewSettingsDialog = Fragment.load({
                    id: oView.getId(),
                    name: "novamart.distributors.inventoryportal.fragment.ViewSettings",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pViewSettingsDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onConfirmViewSettings: function (oEvent) {
            var oTable = this.byId("productList");
            var oBinding = oTable.getBinding("items");
            var mParams = oEvent.getParameters();

            var aSorters = [];
            if (mParams.groupItem) {
                var sGroupPath = mParams.groupItem.getKey();
                var bGroupDescending = mParams.groupDescending;
                aSorters.push(new Sorter(sGroupPath, bGroupDescending, true));
            }

            if (mParams.sortItem) {
                var sSortPath = mParams.sortItem.getKey();
                var bSortDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sSortPath, bSortDescending));
            }
            oBinding.sort(aSorters);

            // Filters
            var aFilters = [];

            mParams.filterItems.forEach(function (oItem) {

                var sFilterPath = oItem.getParent().getKey();
                var sKey = oItem.getKey();

                if (sFilterPath === "category") {

                    aFilters.push(
                        new Filter("category", FilterOperator.EQ, sKey)
                    );

                } else if (sFilterPath === "price") {

                    switch (sKey) {

                        case "below100":
                            aFilters.push(
                                new Filter("price", FilterOperator.LT, 100)
                            );
                            break;

                        case "100to500":
                            aFilters.push(
                                new Filter({
                                    filters: [
                                        new Filter("price", FilterOperator.GE, 100),
                                        new Filter("price", FilterOperator.LE, 500)
                                    ],
                                    and: true
                                })
                            );
                            break;

                        case "above500":
                            aFilters.push(
                                new Filter("price", FilterOperator.GT, 500)
                            );
                            break;
                    }
                }

            });

            oBinding.filter(aFilters);
        }

    });
});