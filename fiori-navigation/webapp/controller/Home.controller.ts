import Base from "./Base.controller";

/**
 * @namespace webapp.controller
 */

export default class Home extends Base {
  public onInit(): void {}

  //   public onDisplayTarget() {
  //     this.displayTarget({ target: "notFound" });
  //   }

  onDisplayNotFound(): void {
    this.displayTarget({ target: "notFound", fromTarget: "home" });
  }

  onNavToEmployees(): void {
    this.getRouter().navTo("employeeList");
  }

  onNavToEmployeeOverview(): void {
    this.getRouter().navTo("employeeOverview");
  }
}
