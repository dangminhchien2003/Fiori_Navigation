import Base from "webapp/controller/Base.controller";
import Filter from "sap/ui/model/Filter";
import ViewSettingsItem from "sap/m/ViewSettingsItem";
import ViewSettingsDialog, { ViewSettingsDialog$ConfirmEvent } from "sap/m/ViewSettingsDialog";
import FilterOperator from "sap/ui/model/FilterOperator";
import SearchField from "sap/m/SearchField";
import ListBinding from "sap/ui/model/ListBinding";
import Sorter from "sap/ui/model/Sorter";
import Table from "sap/m/Table";

/**
 * @namespace webapp.controller.employee.overview
 */

export default class EmployeeOverviewContent extends Base {
  private _oTable: Table | null = null;
  private _oVSD: ViewSettingsDialog | null = null;
  private _sSortField: string | null = null;
  private _bSortDescending = false;
  private _aValidSortFields: string[] = ["EmployeeID", "FirstName", "LastName"];
  private _sSearchQuery: string | null = null;
  private _oRouterArgs: any = { "?query": {} };

  public override onInit(): void {
    const oRouter = this.getRouter();

    this._oTable = this.byId("employeesTable") as Table;
    this._oVSD = null;
    this._sSortField = null;
    this._bSortDescending = false;
    this._aValidSortFields = ["EmployeeID", "FirstName", "LastName"];
    this._sSearchQuery = null;

    this._initViewSettingsDialog();

    // make the search bookmarkable
    oRouter.getRoute("employeeOverview")?.attachMatched(this._onRouteMatched.bind(this));
  }

  public onSortButtonPressed(oEvent: any): void {
    const oRouter = this.getRouter();
    this._oRouterArgs["?query"].showDialog = 1;
    oRouter.navTo("employeeOverview", this._oRouterArgs);
  }

  private _onRouteMatched(oEvent: any): void {
    // save the current query state
    this._oRouterArgs = oEvent.getParameter("arguments");
    this._oRouterArgs["?query"] = this._oRouterArgs["?query"] || {};
    const oQueryParameter = this._oRouterArgs["?query"];

    // search/filter via URL hash
    this._applySearchFilter(oQueryParameter.search);

    // sorting via URL hash
    this._applySorter(oQueryParameter.sortField, oQueryParameter.sortDescending);

    // show dialog via URL hash
    if (oQueryParameter.showDialog) {
      this._oVSD?.open();
    }
  }

  public onSearchEmployeesTable(oEvent: any): void {
    const oRouter = this.getRouter();

    this._oRouterArgs["?query"].search = oEvent.getSource().getValue();
    oRouter.navTo("employeeOverview", this._oRouterArgs, true /*no history*/);
  }

  public _initViewSettingsDialog(): void {
    const oRouter = this.getRouter();
    this._oVSD = new ViewSettingsDialog("vsd", {
      confirm: (oEvent: ViewSettingsDialog$ConfirmEvent) => {
        const oSortItem = oEvent.getParameter("sortItem") as ViewSettingsItem;

        // const sortDescending = oEvent.getParameter("sortDescending") ?? false;
        this._oRouterArgs["?query"].sortField = oSortItem.getKey();
        this._oRouterArgs["?query"].sortDescending = oEvent.getParameter("sortDescending");
        delete this._oRouterArgs["?query"].showDialog; // we don't want to store this in the URL
        oRouter.navTo("employeeOverview", this._oRouterArgs, true /*without history*/);
      },
      cancel: () => {
        delete this._oRouterArgs["?query"].showDialog; // we don't want to store this in the URL
        oRouter.navTo("employeeOverview", this._oRouterArgs, true /*without history*/);
      },
    });

    // init sorting (with simple sorters as custom data for all fields)
    this._oVSD.addSortItem(
      new ViewSettingsItem({
        key: "EmployeeID",
        text: "Employee ID",
        selected: true, // by default the MockData is sorted by EmployeeID
      })
    );

    this._oVSD.addSortItem(
      new ViewSettingsItem({
        key: "FirstName",
        text: "First Name",
        selected: false,
      })
    );

    this._oVSD.addSortItem(
      new ViewSettingsItem({
        key: "LastName",
        text: "Last Name",
        selected: false,
      })
    );
  }

  private _applySearchFilter(sSearchQuery: string): void {
    const aFilters: Filter[] = [];
    let oFilter: Filter | null = null;
    let oBinding: any;

    // first check if we already have this search value
    if (this._sSearchQuery === sSearchQuery) {
      return;
    }
    this._sSearchQuery = sSearchQuery;
    (this.byId("searchField") as SearchField)?.setValue(sSearchQuery);

    // add filters for search
    if (sSearchQuery && sSearchQuery.length > 0) {
      aFilters.push(new Filter("FirstName", FilterOperator.Contains, sSearchQuery));
      aFilters.push(new Filter("LastName", FilterOperator.Contains, sSearchQuery));
      oFilter = new Filter({ filters: aFilters, and: false }); // OR filter
    } else {
      oFilter = null;
    }

    // update list binding
    oBinding = this._oTable?.getBinding("items") as ListBinding;
    oBinding?.filter(oFilter ?? [], "Application");
  }

  /**
   * Applies sorting on our table control.
   * @param {string} sSortField		the name of the field used for sorting
   * @param {string} sortDescending	true or false as a string or boolean value to specify a descending sorting
   * @private
   */
  private _applySorter(sSortField: string, sortDescending: boolean | string): void {
    let bSortDescending: boolean;
    let oBinding: ListBinding | null;
    let oSorter: Sorter;

    if (sSortField && this._aValidSortFields.indexOf(sSortField as any) > -1) {
      // convert sortDescending to boolean
      if (typeof sortDescending === "string") {
        bSortDescending = sortDescending === "true";
      } else if (typeof sortDescending === "boolean") {
        bSortDescending = sortDescending;
      } else {
        bSortDescending = false;
      }

      // check if we already have this sorting
      if (this._sSortField && this._sSortField === sSortField && this._bSortDescending === bSortDescending) {
        return;
      }

      this._sSortField = sSortField;
      this._bSortDescending = bSortDescending;
      oSorter = new Sorter(sSortField, bSortDescending);

      // sync with View Settings Dialog
      this._syncViewSettingsDialogSorter(sSortField, bSortDescending);

      oBinding = this._oTable?.getBinding("items") as ListBinding;
      oBinding?.sort(oSorter);
    }
  }
  private _syncViewSettingsDialogSorter(sSortField: string, bSortDescending: boolean): void {
    // the possible keys are: "EmployeeID" | "FirstName" | "LastName"
    // Note: no input validation is implemented here
    this._oVSD?.setSelectedSortItem(sSortField);
    this._oVSD?.setSortDescending(bSortDescending);
  }

  public onItemPressed(oEvent: any): void {
    const oItem = oEvent.getParameter("listItem");
    const oCtx = oItem.getBindingContext();
    this.getRouter().navTo("employeeResume", {
      employeeId: oCtx?.getProperty("EmployeeID"),
      "?query": { tab: "Info" },
    });
  }
}
