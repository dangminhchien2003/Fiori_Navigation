import History from "sap/ui/core/routing/History";
import Base from "../Base.controller";
/**
 * @namespace webapp.controller.employee
 */
export default class EmployeeList extends Base {
  public onInit(): void {}

  public onListItemPressed(oEvent: any): void {
     const oItem = oEvent.getSource();
        const oCtx = oItem.getBindingContext();
        this.getRouter().navTo("employee", {
            employeeId: oCtx.getProperty("EmployeeID")
        });
  }

//   public onNavBack():void {
//     const history = History.getInstance();
//     const prevHash = history.getPreviousHash();

//     if (prevHash !== undefined) {
//       window.history.go(-1);
//     } else {
//       // eslint-disable-next-line no-alert
//       alert("no history");
//     }
//   }
}
