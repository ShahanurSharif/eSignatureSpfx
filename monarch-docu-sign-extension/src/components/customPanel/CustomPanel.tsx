import { DefaultButton, PrimaryButton } from "@fluentui/react";
import * as React from "react";
import Recipients from "../recipients/Recipients";
import { IESignatureStep } from "../common/Types";
import "./CustomPanel.scss";
import Fields from "../fields/Fields";
import SendEmail from "../sendEmail/SendEmail";
import { ListViewCommandSetContext } from "@microsoft/sp-listview-extensibility";

type ICustomPanelProps = {
  isLoading: boolean;
  fileUrl: string;
  context: ListViewCommandSetContext;
};
const CustomPanel: React.FC<ICustomPanelProps> = ({
  isLoading,
  fileUrl,
  context,
}) => {
  const [currentStep, setCurrentStep] = React.useState<IESignatureStep>(
    IESignatureStep.Step_1
  );
  const onNextClick = () => {
    if (currentStep === IESignatureStep.Step_1)
      setCurrentStep(IESignatureStep.Step_2);
    if (currentStep === IESignatureStep.Step_2)
      setCurrentStep(IESignatureStep.Step_3);
  };

  const onBackClick = () => {
    if (currentStep === IESignatureStep.Step_2)
      setCurrentStep(IESignatureStep.Step_1);
    if (currentStep === IESignatureStep.Step_3)
      setCurrentStep(IESignatureStep.Step_2);
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header or controls */}
      <div style={{ padding: "10px" }}>
        <h2>Create a signature request</h2>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 16px" }}>
        {/* Step 1 */}
        {currentStep === IESignatureStep.Step_1 && (
          <div>
            <Recipients context={context} />
          </div>
        )}

        {/* Step 2 */}
        {currentStep === IESignatureStep.Step_2 && (
          <div>
            <Fields context={context} />
          </div>
        )}

        {/* Step 3 */}
        {currentStep === IESignatureStep.Step_3 && (
          <div>
            <SendEmail />
          </div>
        )}
      </div>

      {/* Footer buttons */}
      <div className="footer">
        {currentStep !== IESignatureStep.Step_1 && (
          <DefaultButton
            className="defaultButton"
            text="Back"
            onClick={onBackClick}
          />
        )}
        <PrimaryButton
          text={currentStep !== IESignatureStep.Step_3 ? "Next" : "Submit"}
          disabled={isLoading}
          onClick={onNextClick}
        />
      </div>
    </div>
  );
};

export default CustomPanel;
