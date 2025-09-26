import JSONModel from "sap/ui/model/json/JSONModel";
import Base from "../Base.controller";

/**
 * @namespace webapp.controller.employee
 */

type TabKey = "Info" | "Projects" | "Hobbies" | "Notes";

interface RouteArgs {
    employeeId: string;
    "?query"?: {
        tab?: TabKey;
    };
}

export default class Resume extends Base {
    private readonly _aValidTabKeys: TabKey[] = ["Info", "Projects", "Hobbies", "Notes"];

    public override onInit(): void {   
        const oRouter = this.getRouter();
        // oRouter.getRoute("employeeResume")?.attachMatched((e) => this._onRouteMatched(e)); 
        this.getView()?.setModel(new JSONModel(), "view");
        oRouter.getRoute("employeeResume")?.attachMatched(this._onRouteMatched.bind(this));
    }

    private _onRouteMatched(oEvent: any): void {
        const oArgs = oEvent.getParameter("arguments") as RouteArgs;
        const oView = this.getView();
        if (!oView) return;

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

        const oQuery = oArgs["?query"];
        const selected = oQuery?.tab;

         if (selected && this._aValidTabKeys.includes(selected)) {
            (oView.getModel("view") as JSONModel)?.setProperty("/selectedTabKey", selected);

            if (selected === "Hobbies" || selected === "Notes") {
               void this.getRouter()
                    .getTargets()
                    ?.display("resumeTab" + selected);
            }
        } else {
            this.getRouter().navTo(
                "employeeResume",
                {
                    employeeId: oArgs.employeeId,
                    "?query": { tab: this._aValidTabKeys[0] },
                },
                true
            );
        }
    }

    private _onBindingChange(): void {
        if (!this.getView()?.getBindingContext()) {
            void this.getRouter().getTargets()?.display("notFound");
        }
    }

    onTabSelect(oEvent: any): void {
        const selectedKey = (oEvent.getParameter("selectedKey") as TabKey) || this._aValidTabKeys[0];
        const employeeId = this.getView()?.getBindingContext()?.getProperty("EmployeeID");

        this.getRouter().navTo(
            "employeeResume",
            {
                employeeId,
                "?query": { tab: selectedKey },
            },
            true
        );
    }
}