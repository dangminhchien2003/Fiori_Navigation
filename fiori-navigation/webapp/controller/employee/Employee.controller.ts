import Base from "../Base.controller";

/**
 * @namespace webapp.controller.employee
 */

export default class Employee extends Base {
  public override onInit(): void {
    const oRouter = this.getRouter();
    oRouter.getRoute("employee")?.attachMatched((e) => this._onRouteMatched(e));
  }

  private _onRouteMatched(oEvent: any): void {
    const oArgs = oEvent.getParameter("arguments") as { employeeId: string };
    const oView = this.getView();

    oView?.bindElement({
      path: `/Employees(${oArgs.employeeId})`,
      events: {
        change: this._onBindingChange.bind(this),
        dataRequested: () => {
          oView.setBusy(true);
        },
        dataReceived: () => {
          oView.setBusy(false);
        },
      },
    });
  }

  private _onBindingChange(): void {
    if (!this.getView()?.getBindingContext()) {
      void this.getRouter().getTargets()?.display("notFound");
    }
  }

  public onShowResume(): void {
    const oCtx = this.getView()?.getElementBinding()?.getBoundContext();
    this.getRouter().navTo("employeeResume", {
      employeeId: oCtx?.getProperty("EmployeeID"),
    });
  }
}
