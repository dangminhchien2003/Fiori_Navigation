import BaseComponent from "sap/ui/core/UIComponent";
import { createDeviceModel } from "./model/models";
import Control from "sap/ui/core/Control";
import View from "sap/ui/core/mvc/View";
import Device from "sap/ui/Device";

/**
 * @namespace webapp
 */
export default class Component extends BaseComponent {

	public static metadata = {
		manifest: "json",
        interfaces: [
            "sap.ui.core.IAsyncContentCreation"
        ]
	};

	public init() : void {
		// call the base component's init function
		super.init();

        // set the device model
        this.setModel(createDeviceModel(), "device");

        // enable routing
        this.getRouter().initialize();
	}


      // Initialize the application asynchronously
  // It makes the application a lot faster and, through that, better to use.
  public override createContent(): Control | Promise<Control | null> | null {
    const appView = View.create({
      viewName: `${this.getAppID()}.view.App`,
      type: "XML",
      viewData: { component: this },
    });

    appView
      .then((view) => {
        view.addStyleClass(this.getContentDensityClass());
      })
      .catch((error) => {
        console.log(error);
      });

    return appView;
  }

  public getAppID() {
    return <string>this.getManifestEntry("/sap.app/id");
  }

  public getContentDensityClass(): string {
    return Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact";
  }
}