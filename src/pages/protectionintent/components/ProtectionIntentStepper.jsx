import { Step, StepLabel, Stepper } from "@mui/material";

export default function ProtectionIntentStepper({ steps, activeStep }) {
  return (
    <Stepper
      activeStep={activeStep}
      sx={{
        width: "100%",
        "& .MuiStep-root": { flex: "0 0 auto", px: 0 },
        "& .MuiStepConnector-root": { flex: "0 1 30px", mx: 1 },
      }}
    >
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
