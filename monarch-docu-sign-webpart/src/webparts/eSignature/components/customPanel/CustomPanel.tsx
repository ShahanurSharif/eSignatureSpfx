import { DefaultButton, PrimaryButton } from "@fluentui/react";
import * as React from "react";
import Recipients from "../recipients/Recipients";
import { IESignatureStep } from "../common/Types";
import "./CustomPanel.scss";
import Fields from "../fields/Fields";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import SendEmail from "../sendEmail/SendEmail";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateControlFinalizeStatus } from "../../store/store";

type ICustomPanelProps = {
  isLoading: boolean;
  fileUrl: string;
  context: WebPartContext;
};
const CustomPanel: React.FC<ICustomPanelProps> = ({
  isLoading,
  fileUrl,
  context,
}) => {
  const dispatch = useAppDispatch();
  const recipients = useAppSelector((state) => state.esignature.recipients);
  const controls = useAppSelector((state) => state.esignature.controls);
  const isFinalized = useAppSelector((state) => state.esignature.title !== "");

  const [currentStep, setCurrentStep] = React.useState<IESignatureStep>(
    IESignatureStep.Step_1
  );
  const onNextClick = () => {
    if (currentStep === IESignatureStep.Step_1)
      setCurrentStep(IESignatureStep.Step_2);
    if (currentStep === IESignatureStep.Step_2) {
      setCurrentStep(IESignatureStep.Step_3);
      // Finalize controls when moving to Step 3
      dispatch(updateControlFinalizeStatus(true));
    }
  };

  const onBackClick = () => {
    if (currentStep === IESignatureStep.Step_2)
      setCurrentStep(IESignatureStep.Step_1);
    if (currentStep === IESignatureStep.Step_3) {
      setCurrentStep(IESignatureStep.Step_2);
      // Reset controls to not finalized when going back to Step 2
      dispatch(updateControlFinalizeStatus(false));
    }
  };

  const isValidStep = (): boolean => {
    switch (currentStep) {
      case IESignatureStep.Step_1:
        return recipients.length > 0;

      case IESignatureStep.Step_2:
        const signatureControls = controls.filter(
          (control) => control.type === "SIGNATURE" && control.isRequired
        );
        return recipients.length === signatureControls.length;

      case IESignatureStep.Step_3:
        return isFinalized;

      default:
        return true; // Or false, depending on whether unknown steps should pass
    }
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
          disabled={isLoading || !isValidStep()}
          onClick={onNextClick}
        />
      </div>
    </div>
  );
};

export default CustomPanel;
