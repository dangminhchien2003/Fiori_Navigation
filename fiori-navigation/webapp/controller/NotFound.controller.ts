import Router from "sap/ui/core/routing/Router";
import BaseController from "./Base.controller";

/**
 * @namespace webapp.controller
 */
export default class NotFound extends BaseController {
  private _oData?: { fromTarget?: string };

  public override onInit(): void {
    const oRouter: Router = this.getRouter();
    const oTarget = oRouter.getTarget("notFound");

    (oTarget as any)?.attachDisplay((oEvent: any) => {
      this._oData = oEvent.getParameter("data");
    }, this);
  }

  public onPressed() {
    this.getRouter().navTo("appHome");
  }
  
}
